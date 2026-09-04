import type { PedidoDTO } from "../dto/PedidoDTO";

class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/api/pedido";
    }

    async obterListaDePedidos(): Promise<PedidoDTO[]> {
        try {
            const token = localStorage.getItem("token");

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointPedido}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token ?? ''}`,
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            if (respostaAPI.ok) {
                const dados = await respostaAPI.json();
                const lista = Array.isArray(dados)
                    ? dados
                    : dados?.pedidos ?? dados?.data ?? dados?.results;
                return Array.isArray(lista) ? lista : [];
            } else {
                throw new Error("Não foi possível listar os pedidos.");
            }

        } catch (error) {
            console.error("Erro ao fazer a consulta de pedidos.", error);
            return [];
        }
    }

    async obterPedidoPorId(id: number) {
        try {
            const token = localStorage.getItem("token");

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointPedido}/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token ?? ''}`,
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            if (!respostaAPI.ok) {
                throw new Error("Não foi possível buscar o pedido por ID.");
            }

            const resposta = await respostaAPI.json();
            return resposta;

        } catch (error) {
            console.error("Erro ao buscar pedido por ID.", error);
            return null;
        }
    }

    async enviarFormularioPedido(formPedido: PedidoDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(formPedido)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async deletarPedido(idPedido: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idPedido}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? 'Não foi possível excluir o pedido.' };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }

    async atualizarPedido(idPedido: number, pedido: PedidoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idPedido}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(pedido)
            });
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: respostaAPI.ok, mensagem: dados.mensagem };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }
}

export default new PedidoRequests();