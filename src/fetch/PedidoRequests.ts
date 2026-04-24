class PedidoRequests {
  private serverURL: string;
  private endpointPedido: string;

  constructor() {
    this.serverURL = `http://localhost:3333`;
    this.endpointPedido = `/api/pedidos`;
  }

  async listarPedidos() {
    try {
      const token = localStorage.getItem('token');

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointPedido}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': `${token}`,
          },
        }
      );

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      } else {
        throw new Error('Não foi possível listar os pedidos.');
      }
    } catch (error) {
      console.error(`Erro ao buscar pedidos. ${error}`);
      return;
    }
  }
}

export default new PedidoRequests();