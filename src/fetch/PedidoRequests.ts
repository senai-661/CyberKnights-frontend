import type { PedidoDTO } from "../dto/PedidoDTO";

class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/api/pedido";
    }

    private extrairLista(dados: unknown): unknown[] {
        if (Array.isArray(dados)) return dados;
        if (typeof dados !== 'object' || dados === null) return [];

        const resposta = dados as Record<string, unknown>;
        return this.extrairLista(
            resposta.pedidos ?? resposta.data ?? resposta.results ?? resposta.result ?? resposta.items
        );
    }

    private normalizarPedido(pedido: Record<string, unknown>): PedidoDTO {
        return {
            ...pedido,
            idPedido: Number(pedido.idPedido ?? pedido.id_pedido ?? pedido.id),
            idCliente: Number(pedido.idCliente ?? pedido.id_cliente),
            idProduto: Number(pedido.idProduto ?? pedido.id_produto),
            dataPedido: new Date(String(pedido.dataPedido ?? pedido.data_pedido ?? '')),
            valorTotal: Number(pedido.valorTotal ?? pedido.valor_total ?? 0),
            statusPedido: String(pedido.statusPedido ?? pedido.status_pedido ?? '')
        };
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
                return this.extrairLista(dados)
                    .filter((pedido): pedido is Record<string, unknown> => typeof pedido === 'object' && pedido !== null)
                    .map((pedido) => this.normalizarPedido(pedido));
            } else {
                const dados = await respostaAPI.json().catch(() => ({}));
                throw new Error(dados.mensagem ?? dados.message ?? dados.error ?? `Não foi possível listar os pedidos (${respostaAPI.status}).`);
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

            if (!respostaAPI.ok) {
                const dados = await respostaAPI.json().catch(() => ({}));
                throw new Error(dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);
            }

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async deletarPedido(idPedido: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isInteger(idPedido) || idPedido <= 0) {
                return { sucesso: false, mensagem: 'ID do pedido inválido.' };
            }

            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idPedido}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status} ao excluir o pedido.` };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }

    async atualizarPedido(idPedido: number, pedido: PedidoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isInteger(idPedido) || idPedido <= 0) {
                return { sucesso: false, mensagem: 'ID do pedido inválido.' };
            }

            const token = localStorage.getItem('token');
            const url = `${this.serverURL}${this.endpointPedido}/${idPedido}`;
            const opcoes = {
                headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(pedido)
            };
            let respostaAPI = await fetch(url, {
                method: 'PUT',
                ...opcoes
            });
            if (respostaAPI.status === 404 || respostaAPI.status === 405) {
                respostaAPI = await fetch(url, { method: 'PATCH', ...opcoes });
            }
            const dados = await respostaAPI.json().catch(() => ({}));
            return {
                sucesso: respostaAPI.ok,
                mensagem: dados.mensagem ?? dados.message ?? dados.error ?? (respostaAPI.ok ? undefined : `Erro ${respostaAPI.status} ao atualizar o pedido.`)
            };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }
}

export default new PedidoRequests();

//djfnsdufhwruisglagfkksyfgdukywgfuksydgfiykSGDKFGSDFISYDFGUKYwefgiYKSFGDUsydfguks\yfguyukysdgfuh\fyukdsedfguysfguwyefyfgweyujg\usydf