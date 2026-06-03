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

function DetalhesProdutos(): JSX.Element {

    
    const { id_produto } = useParams<{ id_produto: string }>();

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        buscarProduto();
    }, [id_produto]); 

    const buscarProduto = async () => {
        try {

            if (!id_produto) {
                setErro("ID do produto não informado");
                setLoading(false);
                return;
            }

            
            const resposta = await ProdutoRequests.obterProdutoPorId(Number(id_produto));

            if (!resposta) {
                setErro("Produto não encontrado");
                return;
            }

            setProduto(resposta);

        } catch (error) {
            setErro("Erro ao buscar produto");
        } finally {
            setLoading(false);
        }
    };

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
                title="Detalhes do Produto"
                className="w-6 shadow-4"
            >
                <div className="mb-3">
                    <h3>ID do Produto</h3>
                    <p>{produto?.idProduto}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Nome do Produto</h3>
                    <p>{produto?.nomeProduto}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Preço</h3>
                    <p>R$ {produto?.preco}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Disponibilidade</h3>
                    <Tag
                        value={produto?.disponibilidade}
                        severity={getDisponibilidadeSeverity(
                            produto?.disponibilidade || ""
                        )}
                    />
                </div>

                <Divider />

                <div className="flex justify-content-end mt-4">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate("/lista/produto")} // ✅ rota corrigida
                    />
                </div>
            </Card>
        </div>
    );
}

export default DetalhesProdutos;