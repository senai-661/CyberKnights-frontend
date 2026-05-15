import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesClientes from "../../../components/Listagens/DetalhesCliente/DetalheCliente";
import Rodape from "../../../components/Rodape/Rodape";
import { useParams } from "react-router-dom";

function PDetalhesClientes(): JSX.Element {
    const { id_cliente } = useParams();  // Recebe o ID do registro acessado

    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <DetalhesClientes id_clientes={Number(id_cliente)} />  {/* Envia o ID para o componente */}
            <Rodape />
        </div>
    );
}

export default PDetalhesClientes;