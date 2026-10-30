export interface PedidoDTO {
    idPedido?: number,
    idCliente: number,
    idProduto: number,
    saborMilkshake?: string,
    ingredientesRemovidos?: string[],
    adicionaisSelecionados?: string[],
    dataPedido: Date,
    valorTotal: number,
    statusPedido: string
}