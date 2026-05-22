import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesCliente from "../../../components/Listagens/DetalhesCliente/DetalheCliente";
import Rodape from "../../../components/Rodape/Rodape";

function PDetalhesClientes(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <DetalhesCliente />
            <Rodape />
        </div>
    );
}

export default PDetalhesClientes;