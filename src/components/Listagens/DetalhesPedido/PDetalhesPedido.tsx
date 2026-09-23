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
        let ativo = true;

        const buscarPedido = async () => {
            try {
                if (!id_pedido || !Number.isSafeInteger(Number(id_pedido)) || Number(id_pedido) <= 0) {
                    if (ativo) setErro("ID do pedido inválido");
                    return;
                }

                const resposta = await PedidoRequests.obterPedidoPorId(Number(id_pedido));
                if (!ativo) return;

                if (!resposta) {
                    setErro("Pedido não encontrado");
                    return;
                }

                setPedido({
                    ...resposta,
                    idPedido: Number(resposta.idPedido ?? resposta.id_pedido ?? resposta.id),
                    idCliente: Number(resposta.idCliente ?? resposta.id_cliente),
                    idProduto: Number(resposta.idProduto ?? resposta.id_produto),
                    dataPedido: new Date(resposta.dataPedido ?? resposta.data_pedido),
                    valorTotal: Number(resposta.valorTotal ?? resposta.valor_total ?? 0),
                    statusPedido: String(resposta.statusPedido ?? resposta.status_pedido ?? '')
                });
            } catch {
                if (ativo) setErro("Erro ao buscar pedido");
            } finally {
                if (ativo) setLoading(false);
            }
        };

        void buscarPedido();
        return () => { ativo = false; };
    }, [id_pedido]); // ✅ depende do id_pedido

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

    if (!pedido) {
        return (
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state">
                    <Message severity="error" text="Não foi possível carregar os detalhes do pedido." />
                </main>
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

                <div className="cliente-details-card">
                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-hashtag" /></div><div className="cliente-detail-copy"><span>ID do pedido</span><strong>{pedido.idPedido}</strong></div></div>
                    <Divider />

                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-user" /></div><div className="cliente-detail-copy"><span>ID do cliente</span><strong>{pedido.idCliente}</strong></div></div>
                    <Divider />

                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-box" /></div><div className="cliente-detail-copy"><span>ID do produto</span><strong>{pedido.idProduto}</strong></div></div>
                    <Divider />

                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-calendar" /></div><div className="cliente-detail-copy"><span>Data do pedido</span><strong>{new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}</strong></div></div>
                    <Divider />

                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-money-bill" /></div><div className="cliente-detail-copy"><span>Valor total</span><strong>{formatarMoeda(pedido.valorTotal)}</strong></div></div>
                    <Divider />

                    <div className="cliente-detail-row"><div className="cliente-detail-row-icon"><i className="pi pi-info-circle" /></div><div className="cliente-detail-copy"><span>Status do pedido</span><strong><Tag value={pedido.statusPedido} severity={getStatusSeverity(pedido.statusPedido)} /></strong></div></div>
                </div>

                <Button label="Voltar" icon="pi pi-arrow-left" className="cliente-details-back" onClick={() => navigate("/lista/pedido")} />
            </main>
        </div>
    );
}

export default PDetalhesPedido;