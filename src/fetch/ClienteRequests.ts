// Classe responsável por fazer requisições à API - aluno
class ClienteRequests {
    private serverURL;
    private endpointCliente;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointCliente = `/api/cliente`;
    }

    async obterListaDeClientes() {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if(respostaAPI.ok) {
                const ListaDeCliente = await respostaAPI.json();
                return ListaDeCliente;
            } else {
                throw new Error("Não foi possível listar os clientes.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de clientes. ${error}`);
            return;
        }
    }

    async obterClientePorId(id: number) {

    try {

        const token = localStorage.getItem('token');

        const respostaAPI = await fetch(
            `${this.serverURL}${this.endpointCliente}/${id}`,
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

export default new ClienteRequests;