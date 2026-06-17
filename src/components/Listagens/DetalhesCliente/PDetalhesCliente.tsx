import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import Navegacao from "../../Navegacao/Navegacao";
import Rodape from "../../Rodape/Rodape";

import ClienteRequest from "../../../fetch/ClienteRequests";
import type { ClienteDTO } from "../../../dto/ClienteDTO";

function PDetalhesCliente(): JSX.Element {

    const { id } = useParams();

    const [cliente, setCliente] = useState<ClienteDTO | null>(null);

    useEffect(() => {

        const buscarCliente = async () => {

            try {

                const dados =
                    await ClienteRequest.obterClientePorId(
                        Number(id)
                    );

                setCliente(dados);

            } catch (error) {

                console.error(error);

            }

        };

        buscarCliente();

    }, [id]);

    if (!cliente) {

        return <h1>Carregando...</h1>;

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
                    backgroundColor: "#f4f7f6",
                }}
            >

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >

                    <h1
                        style={{
                            marginBottom: "20px",
                            color: "#2c3e50",
                        }}
                    >
                        Detalhes do Cliente
                    </h1>

                    <p>
                        <strong>Nome:</strong> {cliente.nome}
                    </p>

                    <p>
                        <strong>Telefone:</strong>{" "}
                        {cliente.telefone}
                    </p>

                    <p>
                        <strong>CPF:</strong> {cliente.cpf}
                    </p>

                    <p>
                        <strong>Endereço:</strong>{" "}
                        {cliente.endereco}
                    </p>

                </div>

            </main>

            <Rodape />

        </div>

    );

}

export default PDetalhesCliente;