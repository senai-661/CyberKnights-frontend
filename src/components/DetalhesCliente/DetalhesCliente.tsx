import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type ClienteDTO from "../../dto/ClienteDTO";
import ClienteRequests from "../../fetch/ClienteRequests";

function DetalhesCliente(): JSX.Element {

    const [cliente, setCliente] = useState<ClienteDTO | null>(null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // PEGA O ID DA URL
    const { id } = useParams();

    useEffect(() => {

        async function buscarCliente() {

            try {

                // VERIFICA SE O ID EXISTE
                if (!id) return;

                // BUSCA O CLIENTE
                const dados =
                    await ClienteRequests.obterClientePorId(
                        Number(id)
                    );

                setCliente(dados);

            } catch (error) {

                console.error(
                    "Erro ao buscar cliente:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        buscarCliente();

    }, [id]);

    // LOADING
    if (loading) {

        return <h1>Carregando...</h1>;

    }

    // CLIENTE NÃO ENCONTRADO
    if (!cliente) {

        return <h1>Cliente não encontrado.</h1>;

    }

    return (

        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f7f6",
                padding: "40px",
            }}
        >

            <div
                style={{
                    backgroundColor: "white",
                    maxWidth: "700px",
                    margin: "0 auto",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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

                <div style={{ marginBottom: "15px" }}>

                    <strong>Nome:</strong>

                    <p>{cliente.nome}</p>

                </div>

                <div style={{ marginBottom: "15px" }}>

                    <strong>Endereço:</strong>

                    <p>{cliente.endereco}</p>

                </div>

                <div style={{ marginBottom: "15px" }}>

                    <strong>Telefone:</strong>

                    <p>{cliente.telefone}</p>

                </div>

                <div style={{ marginBottom: "15px" }}>

                    <strong>CPF:</strong>

                    <p>{cliente.cpf || "Não informado"}</p>

                </div>

                <button
                    onClick={() =>
                        navigate("/lista/cliente")
                    }
                    style={{
                        backgroundColor: "#3f4de3",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Voltar
                </button>

            </div>

        </main>

    );

}

export default DetalhesCliente;