class ProdutoRequests {
  private serverURL: string;
  private endpointProduto: string;

  constructor() {
    this.serverURL = `http://localhost:3333`;
    this.endpointProduto = `/api/produtos`;
  }

  async listarProdutos() {
    try {
      const token = localStorage.getItem('token');

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointProduto}`,
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
        throw new Error('Não foi possível listar os produtos.');
      }
    } catch (error) {
      console.error(`Erro ao buscar produtos. ${error}`);
      return;
    }
  }
}

export default new ProdutoRequests();
