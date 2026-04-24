export default interface PedidoDTO {
    id_Pedido: number,
    cliente: {
        id_cliente: number,
        nome: string,
        email: string,
        endereco: string,
        telefone: string,
        cpf: string,
    },
    produto: {
        id_produto: number,
        nome_produto: string,
        preco: number,
        disponibilidade: string,
    },
    data_pedido: Date,
    status: string,
}   