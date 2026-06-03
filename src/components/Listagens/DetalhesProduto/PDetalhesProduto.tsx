import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import Navegacao from "../../Navegacao/Navegacao";
import Rodape from "../../Rodape/Rodape";

import ProdutoRequest from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";

function PDetalhesProduto(): JSX.Element {

    const { id } = useParams();

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);

    useEffect(() => {

        const buscarProduto = async () => {

            try {

                const dados =
                    await ProdutoRequest.obterProdutoPorId(
                        Number(id)
                    );

                setProduto(dados);

            } catch (error) {

                console.error(error);

            }

        };

        buscarProduto();

    }, [id]);

    if (!produto) {
        return <h1>Carregando...</h1>;
    }

    return (

        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

            <Navegacao />

            <main style={{ flex: 1, padding: "40px 10%", backgroundColor: "#f4f7f6" }}>

                <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>

                    <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
                        Detalhes do Produto
                    </h1>

                    <p>
                        <strong>Nome do produto:</strong> {produto.nomeProduto}
                    </p>

                    <p>
                        <strong>Preço:</strong> R$ {produto.preco}
                    </p>

                    <p>
                        <strong>Disponibilidade:</strong> {produto.disponibilidade}
                    </p>

                </div>

            </main>

            <Rodape />

        </div>

    );

}

export default PDetalhesProduto;