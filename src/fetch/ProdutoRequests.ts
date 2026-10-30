import type { AdicionalProdutoDTO, ProdutoDTO } from "../dto/ProdutoDTO";
import { API_URL } from '../config/api';
import { obterCustomizacaoProduto, obterCustomizacaoProdutoPorNome, salvarCustomizacaoProduto } from '../utils/CustomizacaoProduto';
import { obterIngredientesPadrao } from '../utils/IngredientesPadrao';

class ProdutoRequests {
    private serverURL;
    private endpointProduto;

    constructor() {
        this.serverURL = API_URL;
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
        const idProduto = Number(produto.idProduto ?? produto.id_produto ?? produto.id);
        const nomeProduto = String(produto.nomeProduto ?? produto.nome_produto ?? produto.nome ?? '');
        const customizacaoLocal = obterCustomizacaoProduto(idProduto) ?? obterCustomizacaoProdutoPorNome(nomeProduto);
        const ingredientesOriginais = produto.ingredientes ?? produto.ingredientesProduto ?? produto.ingredientes_produto;
        const ingredientesApi = Array.isArray(ingredientesOriginais)
            ? ingredientesOriginais.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
            : typeof ingredientesOriginais === 'string'
                ? ingredientesOriginais.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean)
                : [];
        const ingredientes = ingredientesApi.length
            ? ingredientesApi
            : customizacaoLocal?.ingredientes.length
                ? customizacaoLocal.ingredientes
                : obterIngredientesPadrao(nomeProduto);
        const adicionaisOriginais = produto.adicionais ?? produto.extras;
        const adicionaisApi = Array.isArray(adicionaisOriginais)
            ? adicionaisOriginais.flatMap((item): AdicionalProdutoDTO[] => {
                if (typeof item !== 'object' || item === null) return [];
                const adicional = item as Record<string, unknown>;
                const nome = String(adicional.nome ?? adicional.nomeAdicional ?? '').trim();
                const preco = Number(adicional.preco ?? adicional.valor ?? 0);
                return nome && Number.isFinite(preco) && preco >= 0 ? [{ nome, preco }] : [];
            })
            : [];
        const adicionais = adicionaisApi.length ? adicionaisApi : customizacaoLocal?.adicionais ?? [];

        return {
            ...produto,
            idProduto,
            nomeProduto,
            preco: Number(produto.preco ?? produto.preço ?? 0),
            disponibilidade: String(produto.disponibilidade ?? ''),
            ingredientes,
            adicionais
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
                const dados: unknown = await respostaAPI.json();
                if (typeof dados !== 'object' || dados === null) return;
                const resposta = dados as Record<string, unknown>;
                const registro = resposta.produto ?? resposta.data ?? dados;
                return typeof registro === 'object' && registro !== null
                    ? this.normalizarProduto(registro as Record<string, unknown>)
                    : undefined;
            } else {
                throw new Error("Não foi possível buscar o produto.");
            }
        } catch (error) {
            console.error(`Erro ao buscar produto por ID. ${error}`);
            return;
        }
    }

     async enviarFormularioProduto(formProduto: ProdutoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
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

                const dados = await respostaAPI.json().catch(() => ({}));
                if (!respostaAPI.ok) {
                    return {
                        sucesso: false,
                        mensagem: dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`
                    };
                }

                const corpo = typeof dados === 'object' && dados !== null ? dados as Record<string, unknown> : {};
                const produtoResposta = corpo.produto ?? corpo.data ?? corpo;
                let idProduto = formProduto.idProduto;
                if (typeof produtoResposta === 'object' && produtoResposta !== null) {
                    const registro = produtoResposta as Record<string, unknown>;
                    const idRetornado = Number(registro.idProduto ?? registro.id_produto ?? registro.id);
                    if (Number.isSafeInteger(idRetornado) && idRetornado > 0) idProduto = idRetornado;
                }

                if (!idProduto && (formProduto.ingredientes?.length || formProduto.adicionais?.length)) {
                    const produtos = await this.obterListaDeProdutos();
                    idProduto = produtos.find((produto) =>
                        produto.nomeProduto.trim().toLocaleLowerCase() === formProduto.nomeProduto.trim().toLocaleLowerCase() &&
                        Number(produto.preco) === Number(formProduto.preco)
                    )?.idProduto;
                }

                if (formProduto.ingredientes || formProduto.adicionais) {
                    salvarCustomizacaoProduto(idProduto, formProduto.nomeProduto, {
                        ingredientes: formProduto.ingredientes ?? [],
                        adicionais: formProduto.adicionais ?? []
                    });
                }

                return { sucesso: true };
            } catch (error) {
                console.error(`Erro ao fazer consulta à API. ${error}`);
                return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
            }
        }

     async deletarProduto(idProduto: number): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            if (!Number.isSafeInteger(idProduto) || idProduto <= 0) {
                return { sucesso: false, mensagem: 'ID do produto inválido.' };
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return { sucesso: false, mensagem: 'Sessão expirada. Faça login novamente.' };
            }

            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    Authorization: `Bearer ${token}`
                }
            });

            const texto = await respostaAPI.text();
            let corpo: unknown = {};
            try {
                corpo = texto ? JSON.parse(texto) : {};
            } catch {
                corpo = { mensagem: texto };
            }

            const dados = typeof corpo === 'object' && corpo !== null ? corpo as Record<string, unknown> : {};
            const sucesso = respostaAPI.ok && dados.sucesso !== false && dados.success !== false;

            return {
                sucesso,
                mensagem: sucesso ? undefined : String(dados.mensagem ?? dados.message ?? dados.error ?? `Erro ${respostaAPI.status} ao excluir o produto.`)
            };
        } catch {
            return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor.' };
        }
     }

         async atualizarProduto(idProduto: number, produto: ProdutoDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
            try {
                if (!Number.isInteger(idProduto) || idProduto <= 0) {
                    return { sucesso: false, mensagem: 'ID do produto inválido.' };
                }

                if (produto.ingredientes || produto.adicionais) {
                    salvarCustomizacaoProduto(idProduto, produto.nomeProduto, {
                        ingredientes: produto.ingredientes ?? [],
                        adicionais: produto.adicionais ?? []
                    });
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

export default new ProdutoRequests();