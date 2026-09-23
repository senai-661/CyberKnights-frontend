import { useEffect, useState, type JSX } from "react";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import PedidoRequests from "../../../fetch/PedidoRequests";
import type { PedidoDTO } from "../../../dto/PedidoDTO";
import Navegacao from "../../Navegacao/Navegacao";
import { useNavigate, useParams } from "react-router-dom"; // ✅ useParams adicionado

function formatarMoeda(valor: number | string): string {
    const numero = Number(String(valor).replace(',', '.'));
    return Number.isFinite(numero) ? numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
}

function PDetalhesPedido(): JSX.Element {

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

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >

            <Navegacao />

            <main
                style={{
                    flex: 1,
                    padding: "40px 10%",
                    backgroundColor: "transparent",
                }}
            >

                <div
                    style={{
                        backgroundColor: "rgba(17, 17, 17, .88)",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >

                    <h1>Detalhes do Pedido</h1>

                    <p>
                        <strong>ID Cliente:</strong> {pedido.idCliente}
                    </p>

                    <p>
                        <strong>ID Produto:</strong> {pedido.idProduto}
                    </p>

                    <p>
                        <strong>Data do Pedido:</strong>{" "}
                        {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                    </p>

                    <p>
                        <strong>Valor Total:</strong> {formatarMoeda(pedido.valorTotal)}
                    </p>

                    <p>
                        <strong>Status:</strong> {pedido.statusPedido}
                    </p>

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
                    <p>R$ {pedido?.valorTotal}</p>
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
            </main>
        </div>
    );
}

export default PDetalhesPedido;