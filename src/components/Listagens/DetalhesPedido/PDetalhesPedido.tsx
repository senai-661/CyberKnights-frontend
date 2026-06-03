import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import Navegacao from "../../Navegacao/Navegacao";
import Rodape from "../../Rodape/Rodape";

import PedidoRequest from "../../../fetch/PedidoRequests";
import type { PedidoDTO } from "../../../dto/PedidoDTO";

function PDetalhesPedido(): JSX.Element {

    const params = useParams<{ id?: string }>();
    const id = params.id;

    const [pedido, setPedido] = useState<PedidoDTO | null>(null);

    useEffect(() => {

        const buscarPedido = async () => {

            console.log("URL:", window.location.href);
            console.log("ID cru:", id);

            if (!id) {
                console.log("ERRO: ID não veio da rota");
                return;
            }

            const idNumero = Number(id);

            console.log("ID convertido:", idNumero);

            if (isNaN(idNumero)) {
                console.log("ERRO: ID inválido");
                return;
            }

            try {

                const dados = await PedidoRequest.obterPedidoPorId(idNumero);

                console.log("RESPOSTA DA API:", dados);

                if (!dados) {
                    console.log("API retornou vazio (null/undefined)");
                    return;
                }

                setPedido(dados);

            } catch (error) {
                console.error("ERRO NO FETCH:", error);
            }

        };

        buscarPedido();

    }, [id]);

    if (!id) {
        return <h1>ID do pedido não encontrado na rota.</h1>;
    }

    if (!pedido) {
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
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >

                    <h1>Detalhes do Pedido</h1>

                    <p>
                        <strong>ID Cliente:</strong> {pedido.idCliente}
                    </p>

                    <p>
                        <strong>ID Produto:</strong> {pedido.idProduto}
                    </p>

                    <p>
                        <strong>Data do Pedido:</strong>{" "}
                        {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                    </p>

                    <p>
                        <strong>Valor Total:</strong> {pedido.valorTotal}
                    </p>

                    <p>
                        <strong>Status:</strong> {pedido.statusPedido}
                    </p>

                </div>

            </main>

            <Rodape />

        </div>

    );

}

export default PDetalhesPedido;