import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import PedidoRequests from "../../../fetch/PedidoRequests";
import type { PedidoDTO } from "../../../dto/PedidoDTO";
import { useNavigate, useParams } from "react-router-dom";
import Navegacao from "../../Navegacao/Navegacao";
import "../DetalhesCliente/DetalheCliente.css";

function DetalhesPedidos(): JSX.Element {

    const formatarMoeda = (valor: number | string | undefined) => {
        const numero = Number(valor);
        return Number.isFinite(numero) ? `R$ ${numero.toFixed(2).replace(".", ",")}` : "";
    };

    const { id_pedido } = useParams<{ id_pedido: string }>();

    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        let ativo = true;

        const carregarPedido = async () => {
            await Promise.resolve();

            try {
                if (!id_pedido) {
                    if (ativo) setErro("ID do pedido não informado");
                    return;
                }

                const resposta = await PedidoRequests.obterPedidoPorId(Number(id_pedido));
                if (!ativo) return;
                if (!resposta) {
                    setErro("Pedido não encontrado");
                    return;
                }

                setPedido(resposta);
            } catch {
                if (ativo) setErro("Erro ao buscar pedido");
            } finally {
                if (ativo) setLoading(false);
            }
        };

        void carregarPedido();
        return () => { ativo = false; };
    }, [id_pedido]);

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
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state"><Skeleton width="100%" height="20rem" /></main>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state"><Message severity="error" text={erro} /></main>
            </div>
        );
    }

    return (
        <div className="cliente-details-page">
            <Navegacao />
            <main className="cliente-details-main">
                <div className="cliente-details-heading">
                    <div className="cliente-details-icon"><i className="pi pi-shopping-bag" /></div>
                    <div><h1>Detalhes do <span>Pedido</span></h1><p>Informações completas do pedido selecionado</p></div>
                </div>
                <Card className="cliente-details-card">
                    {[
                        ["ID do pedido", pedido?.idPedido, "pi-hashtag"],
                        ["ID do cliente", pedido?.idCliente, "pi-user"],
                        ["ID do produto", pedido?.idProduto, "pi-box"],
                        ["Data do pedido", pedido?.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString("pt-BR") : "", "pi-calendar"],
                        ["Valor total", formatarMoeda(pedido?.valorTotal), "pi-money-bill"],
                        ["Status do pedido", <Tag value={pedido?.statusPedido} severity={getStatusSeverity(pedido?.statusPedido || "")} />, "pi-info-circle"]
                    ].map(([label, value, icon], index) => (
                        <div className="cliente-detail-row" key={label as string}>
                            <div className="cliente-detail-row-icon"><i className={`pi ${icon}`} /></div>
                            <div className="cliente-detail-copy"><span>{label}</span><strong>{value}</strong></div>
                            {index < 5 && <Divider />}
                        </div>
                    ))}
                </Card>
                <Button label="Voltar" icon="pi pi-arrow-left" className="cliente-details-back" onClick={() => navigate("/lista/pedido")} />
            </main>
        </div>
    );
}

export default DetalhesPedidos;