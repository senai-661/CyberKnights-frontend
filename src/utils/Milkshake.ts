import type { ProdutoDTO } from '../dto/ProdutoDTO';

export const SABORES_MILKSHAKE = ['Chocolate', 'Morango', 'Ovomaltine', 'Creme'] as const;
export type SaborMilkshake = typeof SABORES_MILKSHAKE[number];

export interface TamanhoMilkshake {
    chave: '350' | '450' | '600';
    nome: 'Pequeno' | 'Médio' | 'Grande';
    mililitros: number;
    preco: number;
    produto: ProdutoDTO;
}

export function identificarTamanhoMilkshake(nomeProduto: string): TamanhoMilkshake['chave'] | null {
    if (!/milk\s?shake/i.test(nomeProduto)) return null;
    const tamanho = nomeProduto.match(/(350|450|600)\s*ml/i)?.[1];
    return tamanho === '350' || tamanho === '450' || tamanho === '600' ? tamanho : null;
}

export function agruparTamanhosMilkshake(produtos: ProdutoDTO[]): TamanhoMilkshake[] {
    const configuracoes: Array<{ chave: TamanhoMilkshake['chave']; nome: TamanhoMilkshake['nome']; mililitros: number; preco: number }> = [
        { chave: '350', nome: 'Pequeno', mililitros: 350, preco: 10 },
        { chave: '450', nome: 'Médio', mililitros: 450, preco: 14.99 },
        { chave: '600', nome: 'Grande', mililitros: 600, preco: 18 }
    ];

    return configuracoes.flatMap((configuracao) => {
        const produto = produtos.find((item) => identificarTamanhoMilkshake(item.nomeProduto) === configuracao.chave);
        return produto ? [{ ...configuracao, produto }] : [];
    });
}

export function nomeMilkshake(tamanho: TamanhoMilkshake, sabor?: string): string {
    return `Milkshake ${tamanho.nome.toLocaleLowerCase()} ${tamanho.mililitros}ml${sabor ? ` - ${sabor}` : ''}`;
}
