import type {ClienteDTO} from "../dto/ClienteDTO";

class ClienteRequests {
    private serverURL;
    private endpointCliente;

    constructor() {
        this.serverURL = 'http://localhost:3333';
        this.endpointCliente = '/api/clientes';
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
                const listaDeClientes = await respostaAPI.json();
                return listaDeClientes;
            } else {
                throw new Error("Não foi possível listar os clientes.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de clientes. ${error}`);
            return;
        }
    }

    async obterClientePorId(id_cliente: number): Promise<ClienteDTO | undefined> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${id_cliente}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token}`
                }
            });

            if (respostaAPI.ok) {
                const cliente: ClienteDTO = await respostaAPI.json();
                return cliente;
            } else {
                throw new Error("Não foi possível buscar o cliente.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de cliente por ID. ${error}`);
            return;
        }
    }
} 

export default new ClienteRequests;