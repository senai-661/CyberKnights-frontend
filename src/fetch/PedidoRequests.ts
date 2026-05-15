class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/api/pedido";
    }

    // LISTAR PEDIDOS
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

            if (!respostaAPI.ok) {
                throw new Error("Erro ao listar pedidos");
            }

            return await respostaAPI.json();
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            return [];
        }
    }

    // (OPCIONAL MAS RECOMENDADO) BUSCAR POR ID
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
                throw new Error("Pedido não encontrado");
            }

            return await respostaAPI.json();
        } catch (error) {
            console.error("Erro ao buscar pedido por ID:", error);
            return null;
        }
    }
}

export default new PedidoRequests();