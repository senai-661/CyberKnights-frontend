import { Link } from "react-router-dom";
import React, { type JSX } from "react";
import { useState, useEffect } from "react";

import type PedidoDTO from "../../../dto/PedidoDTO";
import PedidoRequest from "../../../fetch/PedidoRequests";

import Navegacao from "../../../components/Navegacao/Navegacao";
import Rodape from "../../../components/Rodape/Rodape";

function ListagemPedido(): JSX.Element {

    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);

    useEffect(() => {

        const buscarPedidos = async () => {

            try {

                const listaDePedidos =
                    await PedidoRequest.obterListaDePedidos();

                setPedidos(listaDePedidos || []);

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

        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
        }}>

            <Navegacao />

            <main style={{
                flex: 1,
                padding: "40px 10%",
                backgroundColor: "#f4f7f6",
            }}>

                <h1 style={{
                    color: "#2c3e50",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    marginBottom: "24px",
                }}>
                    Lista de Pedidos
                </h1>

                <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                }}>

                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
                    }}>

                        <thead>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>

                                <th style={estiloCabecalho}>ID</th>
                                <th style={estiloCabecalho}>DATA</th>
                                <th style={estiloCabecalho}>CLIENTE</th>
                                <th style={estiloCabecalho}>PRODUTO</th>
                                <th style={estiloCabecalho}>PREÇO</th>
                                <th style={estiloCabecalho}>STATUS</th>
                                <th style={estiloCabecalho}>AÇÕES</th>

                            </tr>
                        </thead>

                        <tbody>

                            {pedidos.map((pedido) => {

                                const { data, hora } =
                                    formatarDataHora(pedido.data_pedido);

                                return (

                                    <tr key={pedido.id_Pedido}>

                                        <td style={estiloCelula}>
                                            #{pedido.id_Pedido}
                                        </td>

                                        <td style={estiloCelula}>
                                            <div style={{ fontWeight: "bold" }}>{data}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#888" }}>
                                                às {hora}
                                            </div>
                                        </td>

                                        <td style={estiloCelula}>
                                            {pedido.cliente.nome}
                                        </td>

                                        <td style={estiloCelula}>
                                            {pedido.produto.nome_produto}
                                        </td>

                                        <td style={estiloCelula}>
                                            <strong style={{ color: "#2ecc71" }}>
                                                {formatarMoeda(pedido.produto.preco)}
                                            </strong>
                                        </td>

                                        <td style={estiloCelula}>
                                            {pedido.status}
                                        </td>

                                        <td style={estiloCelula}>

                                            <Link to={`/detalhes/pedido/${pedido.id_Pedido}`}>
                                                <button style={btnAcao}>
                                                    Detalhes
                                                </button>
                                            </Link>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            </main>

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

const btnAcao: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
};

export default ListagemPedido;