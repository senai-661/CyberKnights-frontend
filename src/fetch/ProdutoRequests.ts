import type { ProdutoDTO } from "../dto/ProdutoDTO";

class ProdutoRequests {
    private serverURL;
    private endpointProduto;

    constructor() {
        this.serverURL = `http://localhost:3333`;
        this.endpointProduto = `/api/produto`;
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
                const lista = Array.isArray(dados)
                    ? dados
                    : dados?.produtos ?? dados?.data ?? dados?.results;
                return Array.isArray(lista) ? lista : [];
            } else {
                throw new Error("Não foi possível listar os produtos.");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de produtos. ${error}`);
            return [];
        }
    }

    // ✅ MÉTODO NOVO - busca um produto pelo ID
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
            const token = localStorage.getItem('token');
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
                method: 'DELETE',
                headers: { 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            });
            if (respostaAPI.ok) return { sucesso: true };
            const dados = await respostaAPI.json().catch(() => ({}));
            return { sucesso: false, mensagem: dados.mensagem ?? 'Não foi possível excluir o produto.' };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
     }

         async atualizarProduto(idProduto: number, produto: ProdutoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
            try {
                const token = localStorage.getItem('token');
                const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': `${token ?? ''}`, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify(produto)
                });
                const dados = await respostaAPI.json().catch(() => ({}));
                return { sucesso: respostaAPI.ok, mensagem: dados.mensagem };
            } catch {
                return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
            }
         }
    }

export default new ProdutoRequests;