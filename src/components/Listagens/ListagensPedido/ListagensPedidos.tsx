import { useNavigate } from "react-router-dom";
import React, { type JSX } from "react";
import { useState, useEffect } from "react";
import type { PedidoDTO } from "../../../dto/PedidoDTO";
import PedidoRequest from "../../../fetch/PedidoRequests";

import Navegacao from "../../../components/Navegacao/Navegacao";
import Rodape from "../../../components/Rodape/Rodape";

function ListagemPedido(): JSX.Element {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);

    useEffect(() => {
    const buscarPedidos = async () => {
        try {
            const listaDePedidos = await PedidoRequest.obterListaDePedidos();

            console.log("Campos do pedido (raw):", JSON.stringify(listaDePedidos[0]));

            const normalized = (listaDePedidos || []).map((p: any) => ({
                idPedido: p.idPedido ?? p.id_pedido ?? p.id ?? null,
                idCliente: p.idCliente ?? p.id_cliente ?? null,
                idProduto: p.idProduto ?? p.id_produto ?? null,
                dataPedido: p.dataPedido ?? p.data_pedido ?? p.data_pedido ?? null,
                valorTotal: p.valorTotal ?? p.valor_total ?? 0,
                statusPedido: p.statusPedido ?? p.status_pedido ?? "",
            }));

            console.log("Pedido normalizado exemplo:", JSON.stringify(normalized[0]));

            // Não filtrar completamente; exibir resultados normalizados mesmo sem `idPedido`
            setPedidos(normalized as PedidoDTO[]);
        } catch (error) {
            console.error(`Erro ao buscar pedidos. ${error}`);
        }
    };

    buscarPedidos();
}, []);

    const formatarDataHora = (dataIso: string | Date) => {
        const dataObj = new Date(dataIso);

        return {
            data: dataObj.toLocaleDateString("pt-BR"),
            hora: dataObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

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
                        Lista de Pedidos
                    </h1>

                    <button style={btnNovo}>+ Novo Pedido</button>
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
                                <th style={estiloCabecalho}>
                                    DATA / HORA
                                </th>

                                <th style={estiloCabecalho}>
                                    CÓDIGO CLIENTE
                                </th>

                                <th style={estiloCabecalho}>
                                    CÓDIGO PRODUTO
                                </th>

                                <th style={estiloCabecalho}>
                                    VALOR TOTAL
                                </th>

                                <th style={estiloCabecalho}>STATUS</th>

                                <th style={estiloCabecalho}>AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.map((pedido) => {
                                const { data, hora } = formatarDataHora(
                                    pedido.dataPedido.toString()
                                );

                                const idPedido =
                                    pedido.idPedido ??
                                    (pedido as any).id_pedido;

                                return (
                                    <tr
                                        key={idPedido ?? pedido.idPedido}
                                        style={{
                                            borderBottom:
                                                "1px solid #f0f0f0",
                                        }}
                                    >
                                        <td style={estiloCelula}>
                                            <div
                                                style={{
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {data}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "#888",
                                                }}
                                            >
                                                às {hora}
                                            </div>
                                        </td>

                                        <td style={estiloCelula}>
                                            #{pedido.idCliente}
                                        </td>

                                        <td style={estiloCelula}>
                                            #{pedido.idProduto}
                                        </td>

                                        <td style={estiloCelula}>
                                            <div
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#2ecc71",
                                                }}
                                            >
                                                {formatarMoeda(
                                                    pedido.valorTotal
                                                )}
                                            </div>
                                        </td>

                                        <td style={estiloCelula}>
                                            <div style={estiloStatus}>
                                                {pedido.statusPedido}
                                            </div>
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
                                                    onClick={() => {
                                                        const idToNavigate =
                                                            idPedido ??
                                                            pedido.idPedido ??
                                                            (pedido as any).id_pedido;

                                                        console.log(
                                                            "Detalhes click — id encontrado:",
                                                            idToNavigate,
                                                            "pedido objeto:",
                                                            pedido
                                                        );

                                                        if (!idToNavigate) {
                                                            // aviso visual para facilitar o teste
                                                            alert(
                                                                "ID do pedido ausente. Cheque o console para mais detalhes."
                                                            );
                                                            console.error(
                                                                "ID do pedido ausente ao navegar para detalhes:",
                                                                pedido
                                                            );
                                                            return;
                                                        }

                                                        navigate(`/detalhes/pedido/${idToNavigate}`);
                                                    }}
                                                >
                                                    Detalhes
                                                </button>

                                                <button
                                                    style={{
                                                        ...btnAcao,
                                                        color: "#e29d4d",
                                                    }}
                                                >
                                                    Cancelar
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
    backgroundColor: "#ff6b6b",
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

const estiloStatus: React.CSSProperties = {
    fontSize: "0.85rem",
    color: "#666",
    maxWidth: "180px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
};

export default ListagemPedido;