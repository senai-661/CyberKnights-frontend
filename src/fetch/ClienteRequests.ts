import type { ClienteDTO } from "../dto/ClienteDTO";

class ClienteRequests {
    private serverURL;
    private endpointCliente;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointCliente = `/api/cliente`;
    }

    private encontrarEmail(valor: unknown): string {
        if (typeof valor !== 'object' || valor === null) return '';

        for (const [chave, conteudo] of Object.entries(valor)) {
            if (chave.toLowerCase().includes('email')) {
                if (typeof conteudo === 'string' && conteudo.trim()) {
                    return conteudo.trim();
                }
                const emailAninhado = this.encontrarEmail(conteudo);
                if (emailAninhado) return emailAninhado;
            }

            if (typeof conteudo === 'object' && conteudo !== null) {
                const emailAninhado = this.encontrarEmail(conteudo);
                if (emailAninhado) return emailAninhado;
            }
        }

        return '';
    }

    private normalizarCliente(cliente: Record<string, unknown>): ClienteDTO {
        const email = this.encontrarEmail(cliente);

        return { ...cliente, email } as ClienteDTO;
    }

    async obterListaDeClientes(): Promise<ClienteDTO[]> {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            if (respostaAPI.ok) {
                const dados = await respostaAPI.json();
                const lista = Array.isArray(dados)
                    ? dados
                    : dados?.clientes ?? dados?.data?.clientes ?? dados?.data ?? dados?.results;
                return Array.isArray(lista)
                    ? lista.map((cliente) => this.normalizarCliente(cliente as Record<string, unknown>))
                    : [];
            } else {
                throw new Error("Não foi possível listar os clientes.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de clientes. ${error}`);
            return [];
        }
    }

    // ✅ MÉTODO NOVO - busca um cliente pelo ID
    async obterClientePorId(id: number) {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
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

    async enviarFormularioCliente(formCliente: ClienteDTO): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(formCliente)
            });

            if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            return false;
        }
    }

    async deletarCliente(idCliente: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${idCliente}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? 'Não foi possível excluir o cliente.' };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }

    async atualizarCliente(idCliente: number, cliente: ClienteDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${idCliente}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(cliente)
            });
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: respostaAPI.ok, mensagem: dados.mensagem };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }
}

export default new ClienteRequests;