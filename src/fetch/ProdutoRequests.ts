import type { ProdutoDTO } from "../dto/ProdutoDTO";

class ProdutoRequests {
    private serverURL;
    private endpointProduto;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointProduto = `/api/produto`;
    }

    private extrairLista(dados: unknown): unknown[] {
        if (Array.isArray(dados)) return dados;
        if (typeof dados !== 'object' || dados === null) return [];

        const resposta = dados as Record<string, unknown>;
        return this.extrairLista(
            resposta.produtos ?? resposta.data ?? resposta.results ?? resposta.result ?? resposta.items
        );
    }

    private normalizarProduto(produto: Record<string, unknown>): ProdutoDTO {
        return {
            ...produto,
            idProduto: Number(produto.idProduto ?? produto.id_produto ?? produto.id),
            nomeProduto: String(produto.nomeProduto ?? produto.nome_produto ?? produto.nome ?? ''),
            preco: Number(produto.preco ?? produto.preço ?? 0),
            disponibilidade: String(produto.disponibilidade ?? '')
        };
    }

    async obterListaDeProdutos(): Promise<ProdutoDTO[]> {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            if (respostaAPI.ok) {
                const dados = await respostaAPI.json();
                return this.extrairLista(dados)
                    .filter((produto): produto is Record<string, unknown> => typeof produto === 'object' && produto !== null)
                    .map((produto) => this.normalizarProduto(produto));
            } else {
                const dados = await respostaAPI.json().catch(() => ({}));
                throw new Error(dados.mensagem ?? dados.message ?? dados.error ?? `Não foi possível listar os produtos (${respostaAPI.status}).`);
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de produtos. ${error}`);
            return [];
        }
    }

    
    async obterProdutoPorId(id: number) {
        try {
            const token = localStorage.getItem('token');

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${token ?? ''}`,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
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

     async enviarFormularioProduto(formProduto: ProdutoDTO): Promise<boolean> {
            try {
                const token = localStorage.getItem('token');
                const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': `${token ?? ''}`,
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(formProduto)
                });
    
                if (!respostaAPI.ok) throw new Error(`Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);
    
                console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);
    
                return true;
            } catch (error) {
                console.error(`Erro ao fazer consulta à API. ${error}`);
                return false;
            }
        }

     async deletarProduto(idProduto: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isInteger(idProduto) || idProduto <= 0) {
                return { sucesso: false, mensagem: 'ID do produto inválido.' };
            }

            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status} ao excluir o produto.` };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
     }

         async atualizarProduto(idProduto: number, produto: ProdutoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
            try {
                if (!Number.isInteger(idProduto) || idProduto <= 0) {
                    return { sucesso: false, mensagem: 'ID do produto inválido.' };
                }

                const token = localStorage.getItem('token');
                const url = `${this.serverURL}${this.endpointProduto}/${idProduto}`;
                const opcoes = {
                    headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify(produto)
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
                    mensagem: dados.mensagem ?? dados.message ?? dados.error ?? (respostaAPI.ok ? undefined : `Erro ${respostaAPI.status} ao atualizar o produto.`)
                };
            } catch {
                return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
            }
         }
    }

export default new ProdutoRequests;