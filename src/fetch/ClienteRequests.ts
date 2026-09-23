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

        return {
            ...cliente,
            idCliente: Number(cliente.idCliente ?? cliente.id_cliente ?? cliente.id),
            nome: String(cliente.nome ?? ''),
            email,
            endereco: String(cliente.endereco ?? cliente.endereço ?? ''),
            telefone: String(cliente.telefone ?? ''),
            cpf: cliente.cpf == null ? undefined : String(cliente.cpf)
        };
    }

    private extrairLista(dados: unknown): unknown[] {
        if (Array.isArray(dados)) return dados;
        if (typeof dados !== 'object' || dados === null) return [];

        const resposta = dados as Record<string, unknown>;
        return this.extrairLista(
            resposta.clientes ?? resposta.data ?? resposta.results ?? resposta.result ?? resposta.items
        );
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
                return this.extrairLista(dados)
                    .filter((cliente): cliente is Record<string, unknown> => typeof cliente === 'object' && cliente !== null)
                    .map((cliente) => this.normalizarCliente(cliente));
            } else {
                const dados = await respostaAPI.json().catch(() => ({}));
                throw new Error(dados.mensagem ?? dados.message ?? dados.error ?? `Não foi possível listar os clientes (${respostaAPI.status}).`);
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de clientes. ${error}`);
            return [];
        }
    }

    
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

            if (!respostaAPI.ok) {
                const dados = await respostaAPI.json().catch(() => ({}));
                throw new Error(dados.mensagem ?? dados.message ?? `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);
            }

            console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

            return true;
        } catch (error) {
            console.error(`Erro ao fazer consulta à API. ${error}`);
            throw error;
        }
    }

    async deletarCliente(idCliente: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isInteger(idCliente) || idCliente <= 0) {
                return { sucesso: false, mensagem: 'ID do cliente inválido.' };
            }

            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}/${idCliente}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status} ao excluir o cliente.` };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }

    async atualizarCliente(idCliente: number, cliente: ClienteDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isInteger(idCliente) || idCliente <= 0) {
                return { sucesso: false, mensagem: 'ID do cliente inválido.' };
            }

            const token = localStorage.getItem('token');
            const url = `${this.serverURL}${this.endpointCliente}/${idCliente}`;
            const opcoes = {
                headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(cliente)
            };
            let respostaAPI = await fetch(url, {
                method: 'PUT',
                ...opcoes
            });

            if (respostaAPI.status === 404 || respostaAPI.status === 405) {
                respostaAPI = await fetch(url, { method: 'PATCH', ...opcoes });
            }

            const dados = await respostaAPI.json().catch(() => ({}));
            return {
                sucesso: respostaAPI.ok,
                mensagem: dados.mensagem ?? dados.message ?? dados.error ?? (respostaAPI.ok ? undefined : `Erro ${respostaAPI.status} ao atualizar o cliente.`)
            };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
    }
}

export default new ClienteRequests;





//djhudhfgiuwrhgiearluifgsyiftkywaugylaergfuil\ysliufliwruatyliwyrtiuwliyurtglwiygulwyefgl7wiegfyuiwrgfy    gf//