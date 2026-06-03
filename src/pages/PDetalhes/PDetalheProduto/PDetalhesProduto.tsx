import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesProdutos from "../../../components/Listagens/DetalhesProdutos/DetalhesProdutos";
import Rodape from "../../../components/Rodape/Rodape";

function PDetalhesProduto(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">

            <Navegacao />

            <DetalhesProdutos />

            <Rodape />

        </div>
    );
}

export default PDetalhesProduto;