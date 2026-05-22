class PedidoRequests {
    private serverURL;
    private endpointPedido;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointPedido = `/api/pedido`;
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
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível listar os pedidos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pedidos. ${error}`);
            return;
        }
    }

    // ✅ MÉTODO NOVO - busca um pedido pelo ID
    async obterPedidoPorId(id: number) {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível buscar o pedido.");
            }
        } catch (error) {
            console.error(`Erro ao buscar pedido por ID. ${error}`);
            return;
        }
    }
}

export default new PedidoRequests;