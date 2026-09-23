import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import ClienteRequests from "../../../fetch/ClienteRequests";
import type { ClienteDTO } from "../../../dto/ClienteDTO";
import { useNavigate, useParams } from "react-router-dom";
import Navegacao from "../../Navegacao/Navegacao";
import "./DetalheCliente.css";

function DetalhesCliente(): JSX.Element {

    const { id_cliente } = useParams<{ id_cliente: string }>();

    const [cliente, setCliente] = useState<ClienteDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        let ativo = true;

        const carregarCliente = async () => {
            await Promise.resolve();

            try {
                if (!id_cliente) {
                    if (ativo) setErro("ID do cliente não informado");
                    return;
                }

                const resposta = await ClienteRequests.obterClientePorId(Number(id_cliente));

                if (!ativo) return;
                if (!resposta) {
                    setErro("Cliente não encontrado");
                    return;
                }

                setCliente(resposta);
            } catch {
                if (ativo) setErro("Erro ao buscar cliente");
            } finally {
                if (ativo) setLoading(false);
            }
        };

        void carregarCliente();
        return () => { ativo = false; };
    }, [id_cliente]);

    if (loading) {
        return (
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state">
                    <Skeleton width="100%" height="20rem" />
                </main>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="cliente-details-page">
                <Navegacao />
                <main className="cliente-details-main cliente-details-state">
                    <Message severity="error" text={erro} />
                </main>
            </div>
        );
    }

    return (
        <div className="cliente-details-page">
            <Navegacao />
            <main className="cliente-details-main">
                <div className="cliente-details-heading">
                    <div className="cliente-details-icon"><i className="pi pi-user" /></div>
                    <div>
                        <h1>Detalhes do <span>Cliente</span></h1>
                        <p>Informações completas do cliente selecionado</p>
                    </div>
                </div>

                <Card className="cliente-details-card">
                    {[
                        ["ID", cliente?.idCliente, "pi-hashtag"],
                        ["Nome", cliente?.nome, "pi-user"],
                        ["Endereço", cliente?.endereco, "pi-map-marker"],
                        ["Telefone", cliente?.telefone, "pi-phone"],
                        ["CPF", cliente?.cpf, "pi-id-card"]
                    ].map(([label, value, icon], index) => (
                        <div className="cliente-detail-row" key={label}>
                            <div className="cliente-detail-row-icon"><i className={`pi ${icon}`} /></div>
                            <div className="cliente-detail-copy">
                                <span>{label}</span>
                                <strong>{value}</strong>
                            </div>
                            {index < 4 && <Divider />}
                        </div>
                    ))}
                </Card>

                <Button label="Voltar" icon="pi pi-arrow-left" className="cliente-details-back" onClick={() => navigate("/lista/cliente")} />
            </main>
        </div>
    );
}

export default DetalhesCliente;