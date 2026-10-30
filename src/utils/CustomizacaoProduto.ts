import type { AdicionalProdutoDTO } from '../dto/ProdutoDTO';

const CHAVE_CUSTOMIZACOES_PRODUTO = 'customizacoesProdutos';

interface CustomizacaoProduto {
    ingredientes: string[];
    adicionais: AdicionalProdutoDTO[];
}

type CustomizacoesProduto = Record<string, CustomizacaoProduto>;

function lerCustomizacoes(): CustomizacoesProduto {
    try {
        const dados = localStorage.getItem(CHAVE_CUSTOMIZACOES_PRODUTO);
        return dados ? JSON.parse(dados) as CustomizacoesProduto : {};
    } catch {
        return {};
    }
}

export function obterCustomizacaoProduto(idProduto: number): CustomizacaoProduto | undefined {
    if (!Number.isSafeInteger(idProduto) || idProduto <= 0) return undefined;
    return lerCustomizacoes()[String(idProduto)];
}

export function obterCustomizacaoProdutoPorNome(nomeProduto: string): CustomizacaoProduto | undefined {
    const nomeNormalizado = nomeProduto.trim().toLocaleLowerCase();
    if (!nomeNormalizado) return undefined;
    return lerCustomizacoes()[`nome:${nomeNormalizado}`];
}

export function salvarCustomizacaoProduto(
    idProduto: number | undefined,
    nomeProduto: string,
    customizacao: CustomizacaoProduto
): void {
    const nomeNormalizado = nomeProduto.trim().toLocaleLowerCase();
    if ((!Number.isSafeInteger(idProduto) || Number(idProduto) <= 0) && !nomeNormalizado) return;

    try {
        const customizacoes = lerCustomizacoes();
        if (Number.isSafeInteger(idProduto) && Number(idProduto) > 0) {
            customizacoes[String(idProduto)] = customizacao;
        }
        if (nomeNormalizado) customizacoes[`nome:${nomeNormalizado}`] = customizacao;
        localStorage.setItem(CHAVE_CUSTOMIZACOES_PRODUTO, JSON.stringify(customizacoes));
    } catch (error) {
        console.error('Não foi possível salvar ingredientes e adicionais neste navegador.', error);
    }
}
