import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesCliente from "../../../components/Listagens/DetalhesCliente/DetalheCliente";
import Rodape from "../../../components/Rodape/Rodape";
import { useParams } from "react-router-dom";

function PDetalhesClientes(): JSX.Element {
    const { id_cliente } = useParams();  // Recebe o ID do registro acessado

    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <DetalhesCliente id_cliente={Number(id_cliente)} />  {/* Envia o ID para o componente */}
            <Rodape />
        </div>
    );
}

export default PDetalhesClientes;