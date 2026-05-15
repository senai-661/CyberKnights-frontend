import { type JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesPedidos from "../../../components/Listagens/DetalhesPedidos/DetalhesPedidos";
import Rodape from "../../../components/Rodape/Rodape";
import { useParams } from "react-router-dom";

function PDetalhesPedido(): JSX.Element {

    const { id_pedido } = useParams();

    return (
        <div className="min-h-screen flex flex-col">

            <Navegacao />

            <DetalhesPedidos
                id_pedido={Number(id_pedido)}
            />

            <Rodape />

        </div>
    );
}

export default PDetalhesPedido;