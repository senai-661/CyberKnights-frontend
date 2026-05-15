// Classe responsável por fazer requisições à API - aluno
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
                const listaDeProdutos = await respostaAPI.json();
                return listaDeProdutos;
            } else {
                throw new Error("Não foi possível listar os produtos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de produtos. ${error}`);
            return;
        }
    }

    async obterProdutoPorId(id: number) {

        try {

            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointProduto}/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': `${token}`
                    }
                }
            );

            const resposta = await respostaAPI.json();

            return resposta;

        } catch (error) {

            console.error(error);

        }

    }
}

export default new ProdutoRequests;