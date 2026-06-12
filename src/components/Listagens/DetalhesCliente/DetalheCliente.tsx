import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import ClienteRequests from "../../../fetch/ClienteRequests";
import type { ClienteDTO } from "../../../dto/ClienteDTO";
import { useNavigate, useParams } from "react-router-dom";

function DetalhesCliente(): JSX.Element {

    const { id_cliente } = useParams<{ id_cliente: string }>();

    const [cliente, setCliente] = useState<ClienteDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        buscarCliente();
    }, [id_cliente]);

    const buscarCliente = async () => {
        try {

            setLoading(true);
            setErro("");

            console.log("ID DA URL:", id_cliente);

            if (!id_cliente) {
                setErro("ID do cliente não informado");
                setLoading(false);
                return;
            }

            const resposta = await ClienteRequests.obterClientePorId(Number(id_cliente));

            console.log("RESPOSTA API:", resposta);

            if (!resposta) {
                setErro("Cliente não encontrado");
                setLoading(false);
                return;
            }

            // ✅ CORREÇÃO PRINCIPAL AQUI
            setCliente(resposta);

        } catch (error) {
            setErro("Erro ao buscar cliente");
        } finally {
            setLoading(false);
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
            <Card title="Detalhes do Cliente" className="w-6 shadow-4">

                <div className="mb-3">
                    <h3>ID</h3>
                    <p>{cliente?.idCliente}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Nome</h3>
                    <p>{cliente?.nome}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Endereço</h3>
                    <p>{cliente?.endereco}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>Telefone</h3>
                    <p>{cliente?.telefone}</p>
                </div>

                <Divider />

                <div className="mb-3">
                    <h3>CPF</h3>
                    <p>{cliente?.cpf}</p>
                </div>

                <Divider />

                <div className="flex justify-content-end mt-4">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate("/lista/cliente")}
                    />
                </div>

            </Card>
        </div>
    );
}

export default DetalhesCliente;