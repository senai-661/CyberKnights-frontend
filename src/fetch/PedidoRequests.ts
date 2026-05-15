import type {PedidoDTO} from "../dto/PedidoDTO";

class PedidoRequests {
    private serverURL;
    private endpointPedido;

    constructor() {
        this.serverURL = 'http://localhost:3333';
        this.endpointPedido = '/api/pedidos';
    }

    async obterListaDePedidos() {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const listaDePedidos = await respostaAPI.json();
                return listaDePedidos;
            } else {
                throw new Error("Não foi possível listar os pedidos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pedidos. ${error}`);
            return;
        }
    }

    async obterPedidoPorId(id_pedido: number): Promise<PedidoDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${id_pedido}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const pedido: PedidoDTO = await respostaAPI.json();
                return pedido;
            } else {
                throw new Error("Não foi possível buscar o pedido.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pedido por ID. ${error}`);
            return;
        }
    }
} 

export default new PedidoRequests;