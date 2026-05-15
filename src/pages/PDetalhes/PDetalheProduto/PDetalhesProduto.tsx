import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesProdutos from "../../../components/Listagens/DetalhesProdutos/DetalhesProdutos";
import Rodape from "../../../components/Rodape/Rodape";
import { useParams } from "react-router-dom";

function PDetalhesProduto(): JSX.Element {

    const { id_produto } = useParams();

    return (
        <div className="min-h-screen flex flex-col">

            <Navegacao />

            <DetalhesProdutos
                id_produto={Number(id_produto)}
            />

            <Rodape />

        </div>
    );
}

export default PDetalhesProduto;