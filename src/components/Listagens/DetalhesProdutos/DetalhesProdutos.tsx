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
import "../DetalhesCliente/DetalheCliente.css";
import { agruparTamanhosMilkshake, nomeMilkshake } from "../../../utils/Milkshake";

const CHAVE_COMPOSICAO_COMBOS = 'combosComposicao';

function obterItensCombo(produto: ProdutoDTO, idProduto: string | undefined): string[] {
    if (!produto.nomeProduto.trim().toLocaleLowerCase().startsWith('combo:')) return [];

    if (idProduto) {
        try {
            const composicoes: unknown = JSON.parse(localStorage.getItem(CHAVE_COMPOSICAO_COMBOS) ?? '{}');
            if (typeof composicoes === 'object' && composicoes !== null) {
                const itensSalvos = (composicoes as Record<string, unknown>)[idProduto];
                if (Array.isArray(itensSalvos)) {
                    const itens = itensSalvos.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
                    if (itens.length) return itens;
                }
            }
        } catch {
            // Continua tentando recuperar a composição de combos antigos pelo nome.
        }
    }

    const separador = produto.nomeProduto.toLocaleLowerCase().indexOf(' | itens: ');
    if (separador >= 0) {
        return produto.nomeProduto.slice(separador + ' | itens: '.length).split(' + ').map((item) => item.trim()).filter(Boolean);
    }

    return [];
}

function DetalhesProdutos(): JSX.Element {

    const formatarMoeda = (valor: number | string | undefined) => {
        const numero = Number(valor);
        return Number.isFinite(numero) ? `R$ ${numero.toFixed(2).replace(".", ",")}` : "";
    };

    const { id_produto } = useParams<{ id_produto: string }>();

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);
    const [itensCombo, setItensCombo] = useState<string[]>([]);
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
                setItensCombo(obterItensCombo(resposta as ProdutoDTO, id_produto));
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

    const tamanhoMilkshake = produto ? agruparTamanhosMilkshake([produto])[0] : undefined;

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
                    <div className="cliente-details-icon"><i className="pi pi-box" /></div>
                    <div><h1>Detalhes do <span>Produto</span></h1><p>Informações completas do produto selecionado</p></div>
                </div>
                <Card className="cliente-details-card">
                    {[
                        ["ID do produto", produto?.idProduto, "pi-hashtag"],
                        ["Nome do produto", tamanhoMilkshake ? nomeMilkshake(tamanhoMilkshake) : produto?.nomeProduto, "pi-box"],
                        ["Preço", formatarMoeda(tamanhoMilkshake?.preco ?? produto?.preco), "pi-money-bill"],
                        ["Disponibilidade", <Tag value={produto?.disponibilidade} severity={getDisponibilidadeSeverity(produto?.disponibilidade || "")} />, "pi-check-circle"]
                    ].map(([label, value, icon], index) => (
                        <div className="cliente-detail-row" key={label as string}>
                            <div className="cliente-detail-row-icon"><i className={`pi ${icon}`} /></div>
                            <div className="cliente-detail-copy"><span>{label}</span><strong>{value}</strong></div>
                            {index < 3 && <Divider />}
                        </div>
                    ))}
                        {produto?.ingredientes?.length ? <>
                            <Divider />
                            <div className="cliente-detail-row">
                                <div className="cliente-detail-row-icon"><i className="pi pi-list" /></div>
                                <div className="cliente-detail-copy"><span>Ingredientes incluídos</span>
                                    <ul className="combo-details-items">{produto.ingredientes.map((ingrediente) => <li key={ingrediente}>{ingrediente}</li>)}</ul>
                                </div>
                            </div>
                        </> : null}
                        {produto?.adicionais?.length ? <>
                            <Divider />
                            <div className="cliente-detail-row">
                                <div className="cliente-detail-row-icon"><i className="pi pi-plus-circle" /></div>
                                <div className="cliente-detail-copy"><span>Adicionais disponíveis</span>
                                    <ul className="combo-details-items">{produto.adicionais.map((adicional) => <li key={adicional.nome}>{adicional.nome} — {formatarMoeda(adicional.preco)}</li>)}</ul>
                                </div>
                            </div>
                        </> : null}
                    {produto?.nomeProduto.trim().toLocaleLowerCase().startsWith('combo:') && <>
                        <Divider />
                        <div className="cliente-detail-row">
                            <div className="cliente-detail-row-icon"><i className="pi pi-list" /></div>
                            <div className="cliente-detail-copy">
                                <span>Itens do combo</span>
                                {itensCombo.length ? (
                                    <ul className="combo-details-items">
                                        {itensCombo.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                                    </ul>
                                ) : <strong>A composição não foi salva para este combo antigo.</strong>}
                            </div>
                        </div>
                    </>}
                </Card>
                <Button label="Voltar" icon="pi pi-arrow-left" className="cliente-details-back" onClick={() => navigate("/lista/produto")} />
            </main>
        </div>
    );
}

export default DetalhesProdutos;