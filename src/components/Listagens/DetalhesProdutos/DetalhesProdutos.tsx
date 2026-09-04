import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";
import { useNavigate, useParams } from "react-router-dom";
import Navegacao from "../../Navegacao/Navegacao";
import Rodape from "../../Rodape/Rodape";
import "../DetalhesCliente/DetalheCliente.css";

function DetalhesProdutos(): JSX.Element {

    const formatarMoeda = (valor: number | string | undefined) => {
        const numero = Number(valor);
        return Number.isFinite(numero) ? `R$ ${numero.toFixed(2).replace(".", ",")}` : "";
    };

    const { id_produto } = useParams<{ id_produto: string }>();

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        let ativo = true;

        const carregarProduto = async () => {
            await Promise.resolve();

            try {
                if (!id_produto) {
                    if (ativo) setErro("ID do produto não informado");
                    return;
                }

                const resposta = await ProdutoRequests.obterProdutoPorId(Number(id_produto));
                if (!ativo) return;
                if (!resposta) {
                    setErro("Produto não encontrado");
                    return;
                }

                setProduto(resposta);
            } catch {
                if (ativo) setErro("Erro ao buscar produto");
            } finally {
                if (ativo) setLoading(false);
            }
        };

        void carregarProduto();
        return () => { ativo = false; };
    }, [id_produto]);

    const getDisponibilidadeSeverity = (disponibilidade: string) => {
        switch (disponibilidade) {
            case "Disponível":
                return "success";
            case "Poucas Unidades":
                return "warning";
            case "Indisponível":
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
                <Rodape />
            </div>
        );
    }

    if (erro) {
        return (
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state"><Message severity="error" text={erro} /></main>
                <Rodape />
            </div>
        );
    }

    return (
        <div className="cliente-details-page">
            <Navegacao />
            <main className="cliente-details-main">
                <div className="cliente-details-heading">
                    <div className="cliente-details-icon"><i className="pi pi-box" /></div>
                    <div><h1>Detalhes do <span>Produto</span></h1><p>Informações completas do produto selecionado</p></div>
                </div>
                <Card className="cliente-details-card">
                    {[
                        ["ID do produto", produto?.idProduto, "pi-hashtag"],
                        ["Nome do produto", produto?.nomeProduto, "pi-box"],
                        ["Preço", formatarMoeda(produto?.preco), "pi-money-bill"],
                        ["Disponibilidade", <Tag value={produto?.disponibilidade} severity={getDisponibilidadeSeverity(produto?.disponibilidade || "")} />, "pi-check-circle"]
                    ].map(([label, value, icon], index) => (
                        <div className="cliente-detail-row" key={label as string}>
                            <div className="cliente-detail-row-icon"><i className={`pi ${icon}`} /></div>
                            <div className="cliente-detail-copy"><span>{label}</span><strong>{value}</strong></div>
                            {index < 3 && <Divider />}
                        </div>
                    ))}
                </Card>
                <Button label="Voltar" icon="pi pi-arrow-left" className="cliente-details-back" onClick={() => navigate("/lista/produto")} />
            </main>
            <Rodape />
        </div>
    );
}

export default DetalhesProdutos;