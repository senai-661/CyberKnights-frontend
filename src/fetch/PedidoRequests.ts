import type { PedidoDTO } from "../dto/PedidoDTO";

class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/api/pedido";
    }

    async obterListaDePedidos() {
        try {
            const token = localStorage.getItem("token");

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointPedido}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token}`,
                    },
                }
            );

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível listar os pedidos.");
            }

            const listaDePedidos = await respostaAPI.json();
            return listaDePedidos;

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
                        "x-access-token": `${token}`,
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
                    'x-access-token': `${token}`
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
}

export default new PedidoRequests();