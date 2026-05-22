import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import PedidoRequests from "../../../fetch/PedidoRequests";
import type { PedidoDTO } from "../../../dto/PedidoDTO";
import { useNavigate, useParams } from "react-router-dom"; // ✅ useParams adicionado

function DetalhesPedidos(): JSX.Element {

    // ✅ Pegando o ID pela URL em vez de prop
    const { id_pedido } = useParams<{ id_pedido: string }>();

    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        buscarPedido();
    }, [id_pedido]); // ✅ depende do id_pedido

    const buscarPedido = async () => {
        try {

            // ✅ Valida se o ID existe na URL
            if (!id_pedido) {
                setErro("ID do pedido não informado");
                setLoading(false);
                return;
            }

            // ✅ Busca apenas o pedido pelo ID, não a lista toda
            const resposta = await PedidoRequests.obterPedidoPorId(Number(id_pedido));

            if (!resposta) {
                setErro("Pedido não encontrado");
                return;
            }

            setPedido(resposta);

        } catch (error) {
            setErro("Erro ao buscar pedido");
        } finally {
            setLoading(false);
        }
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case "Entregue":
                return "success";
            case "Pendente":
                return "warning";
            case "Cancelado":
                return "danger";
            default:
                return "info";
        }
    };

    if (loading) {
        return (
            <div className="p-4">
                <Skeleton width="100%" height="20rem" />
            </div>
        );
    }

    if (erro) {
        return (
            <div className="p-4">
                <Message severity="error" text={erro} />
            </div>
        );
    }

    return (
        <div className="flex justify-content-center mt-5">
            <Card
                title="Detalhes do Pedido"
                className="w-6 shadow-4"
            >
                <div className="mb-3">
                    <h3>ID do Pedido</h3>
                    <p>{pedido?.idPedido}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>ID do Cliente</h3>
                    <p>{pedido?.idCliente}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>ID do Produto</h3>
                    <p>{pedido?.idProduto}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Data do Pedido</h3>
                    <p>
                        {pedido?.dataPedido
                            ? new Date(pedido.dataPedido).toLocaleDateString("pt-BR")
                            : ""}
                    </p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Valor Total</h3>
                    <p>R$ {pedido?.valorTotal.toFixed(2)}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Status do Pedido</h3>
                    <Tag
                        value={pedido?.statusPedido}
                        severity={getStatusSeverity(pedido?.statusPedido || "")}
                    />
                </div>

                <Divider />

                <div className="flex justify-content-end mt-4">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate("/lista/pedido")} // ✅ rota corrigida
                    />
                </div>
            </Card>
        </div>
    );
}

export default DetalhesPedidos;