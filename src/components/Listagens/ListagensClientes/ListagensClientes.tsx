import React, { type JSX } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ClienteDTO } from "../../../dto/ClienteDTO";
import ClienteRequest from "../../../fetch/ClienteRequests";

// Certifique-se de que os caminhos das importações estão corretos
import Navegacao from "../../../components/Navegacao/Navegacao";
import Rodape from "../../../components/Rodape/Rodape";

function ListagemCliente(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const listaDeClientes = await ClienteRequest.obterListaDeClientes();
                setClientes(listaDeClientes);
            } catch (error) {
                console.error(`Erro ao buscar clientes. ${error}`);
            }
        };

        buscarClientes();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            {/* CABEÇALHO */}
            <Navegacao />

            {/* CONTEÚDO PRINCIPAL */}
            <main
                style={{
                    flex: 1,
                    padding: "40px 10%",
                    backgroundColor: "#f4f7f6",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <h1
                        style={{
                            color: "#2c3e50",
                            fontSize: "1.8rem",
                            fontWeight: "bold",
                            margin: 0,
                        }}
                    >
                        Clientes
                    </h1>

                    <button style={btnNovo}>+ Novo Cliente</button>
                </div>

                <div style={containerTabela}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    borderBottom: "2px solid #f0f0f0",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <th style={estiloCabecalho}>NOME</th>
                                <th style={estiloCabecalho}>ENDEREÇO</th>
                                <th style={estiloCabecalho}>TELEFONE</th>
                                <th style={estiloCabecalho}>CPF</th>
                                <th style={estiloCabecalho}>AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody>
                            {clientes.map((cliente) => {
                                return (
                                    <tr
                                        key={cliente.idCliente}
                                        style={{
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <td style={estiloCelula}>
                                            <div style={{ fontWeight: "bold" }}>
                                                {cliente.nome}
                                            </div>
                                        </td>

                                        <td style={estiloCelula}>
                                            {cliente.endereco}
                                        </td>

                                        <td style={estiloCelula}>
                                            {cliente.telefone}
                                        </td>

                                        <td style={estiloCelula}>
                                            {cliente.cpf || "Não informado"}
                                        </td>

                                        <td style={estiloCelula}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                <button
                                                    style={btnAcao}
                                                    onClick={() => navigate(`/lista/cliente/${cliente.idCliente}`)}
                                                >
                                                    Detalhes
                                                </button>

                                                <button
                                                    style={{
                                                        ...btnAcao,
                                                        color: "#E53E3E",
                                                    }}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* RODAPÉ */}
            <Rodape />
        </div>
    );
}

// ESTILOS

const estiloCabecalho: React.CSSProperties = {
    padding: "16px",
    fontSize: "0.75rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
};

const estiloCelula: React.CSSProperties = {
    padding: "16px",
    fontSize: "0.95rem",
    color: "#333",
};

const containerTabela: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
};

const btnNovo: React.CSSProperties = {
    backgroundColor: "#3f4de3",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
};

const btnAcao: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
};

export default ListagemCliente;