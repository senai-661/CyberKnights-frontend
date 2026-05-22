class ProdutoRequests {
    private serverURL;
    private endpointProduto;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointProduto = `/api/produto`;
    }

    async obterListaDeProdutos() {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível listar os produtos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de produtos. ${error}`);
            return;
        }
    }

    // ✅ MÉTODO NOVO - busca um produto pelo ID
    async obterProdutoPorId(id: number) {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível buscar o produto.");
            }
        } catch (error) {
            console.error(`Erro ao buscar produto por ID. ${error}`);
            return;
        }
    }
}

export default new ProdutoRequests;