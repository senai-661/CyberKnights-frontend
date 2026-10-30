export interface AdicionalProdutoDTO {
    nome: string,
    preco: number
}

export interface ProdutoDTO {
    idProduto?: number,
    nomeProduto: string,
    preco: number,
    disponibilidade: string,
    ingredientes?: string[],
    adicionais?: AdicionalProdutoDTO[]
}