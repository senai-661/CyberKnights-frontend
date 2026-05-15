import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PedidoRequest from "../../fetch/PedidoRequests";
import type PedidoDTO from "../../dto/PedidoDTO";

function PDetalhesPedido() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [pedido, setPedido] = useState<PedidoDTO | null>(null);

    useEffect(() => {

        async function load() {

            if (!id) return;

            const data = await PedidoRequest.obterPedidoPorId(Number(id));

            setPedido(data);

        }

        load();

    }, [id]);

    if (!pedido) return <h1>Pedido não encontrado</h1>;

    return (
        <div>
            <h1>
                Pedido #{pedido.id_Pedido}
            </h1>

            <p>
                Cliente: {pedido.cliente.id_cliente}
            </p>

            <p>
                Produto: {pedido.produto.id_produto}
            </p>

            <p>
                Nome Cliente: {pedido.cliente.nome}
            </p>

            <p>
                Nome Produto: {pedido.produto.nome_produto}
            </p>

            <p>
                Preço Produto: R$ {pedido.produto.preco}
            </p>

            <p>
                Data: {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
            </p>

            <p>
                Status: {pedido.status}
            </p>

            <button onClick={() => navigate("/lista/pedido")}>
                Voltar
            </button>
        </div>
    );
}

export default PDetalhesPedido;