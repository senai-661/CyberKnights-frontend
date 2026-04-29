// Classe responsável por fazer requisições à API - aluno
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

            if(respostaAPI.ok) {
                const listaDePedido = await respostaAPI.json();
                return listaDePedido;
            } else {
                throw new Error("Não foi possível listar os pedidos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de pedidos. ${error}`);
            return;
        }
    }
}

export default new PedidoRequests;