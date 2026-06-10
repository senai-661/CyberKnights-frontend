import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesPedidos from "../../../components/Listagens/DetalhesPedidos/DetalhesPedidos";
import Rodape from "../../../components/Rodape/Rodape";

function PDetalhesPedido(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">

            <Navegacao />

            <DetalhesPedidos />

            <Rodape />

        </div>
    );
}

export default PDetalhesPedido;