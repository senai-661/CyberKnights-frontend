class ClienteRequests {
    private serverURL: string;
    private endpointCliente: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointCliente = "/api/cliente";
    }

    // LISTA TODOS
    async obterListaDeClientes() {
        try {
            const token = localStorage.getItem("token");

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointCliente}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token}`,
                    },
                }
            );

            if (!respostaAPI.ok) {
                throw new Error("Erro ao listar clientes");
            }

            return await respostaAPI.json();
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            return [];
        }
    }

    // 🔥 BUSCAR CLIENTE POR ID (FALTAVA ISSO)
    async obterClientePorId(id: number) {
        try {
            const token = localStorage.getItem("token");

            const respostaAPI = await fetch(
                `${this.serverURL}${this.endpointCliente}/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": `${token}`,
                    },
                }
            );

            if (!respostaAPI.ok) {
                throw new Error("Cliente não encontrado");
            }

            return await respostaAPI.json();
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            return null;
        }
    }
}

export default new ClienteRequests();