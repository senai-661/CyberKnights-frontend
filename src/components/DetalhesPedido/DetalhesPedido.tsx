import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type PedidoDTO from "../../dto/PedidoDTO";
import PedidoRequests from "../../fetch/PedidoRequests";

function DetalhesPedido(): JSX.Element {

    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        async function buscarPedido() {

            try {

                if (!id) return;

                const dados =
                    await PedidoRequests.obterPedidoPorId(Number(id));

                setPedido(dados);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }

        }

        buscarPedido();

    }, [id]);

    if (loading) {
        return <h1>Carregando...</h1>;
    }

    if (!pedido) {
        return <h1>Pedido não encontrado.</h1>;
    }

    return (

        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f7f6",
                padding: "40px",
            }}
        >

            <div
                style={{
                    backgroundColor: "white",
                    maxWidth: "700px",
                    margin: "0 auto",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >

                <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
                    Detalhes do Pedido
                </h1>

                <div style={{ marginBottom: "15px" }}>
                    <strong>ID do Pedido:</strong>
                    <p>{pedido.id_Pedido}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>Cliente:</strong>
                    <p>{pedido.cliente.nome}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>ID Cliente:</strong>
                    <p>{pedido.cliente.id_cliente}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>Produto:</strong>
                    <p>{pedido.produto.nome_produto}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>ID Produto:</strong>
                    <p>{pedido.produto.id_produto}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>Data do Pedido:</strong>
                    <p>
                        {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                    </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>Valor Total:</strong>
                    <p>R$ {pedido.produto.preco}</p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <strong>Status:</strong>
                    <p>{pedido.status}</p>
                </div>

                <button
                    onClick={() => navigate("/lista/pedido")}
                    style={{
                        backgroundColor: "#3f4de3",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Voltar
                </button>

            </div>

        </main>
    );
}

export default DetalhesPedido;