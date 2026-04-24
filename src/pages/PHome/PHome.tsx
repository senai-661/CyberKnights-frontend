import type { JSX } from "react";
import BoasVindas from "../../components/BoasVindas/BoasVindas";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";
 
function PHome(): JSX.Element {
    return (
        <>
            <Navegacao />
            <BoasVindas />
            <Rodape />
        </>
    );
}

export default PHome;