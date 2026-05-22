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

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível listar os clientes.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de clientes. ${error}`);
            return;
        }
    }

    // ✅ MÉTODO NOVO - busca um cliente pelo ID
    async obterClientePorId(id: number) {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                return await respostaAPI.json();
            } else {
                throw new Error("Não foi possível buscar o cliente.");
            }
        } catch (error) {
            console.error(`Erro ao buscar cliente por ID. ${error}`);
            return;
        }
    }
}

export default new ClienteRequests;