import type { JSX } from "react";
import BoasVindas from "../../components/BoasVindas/BoasVindas";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";
<<<<<<< HEAD
 
function PHome(): JSX.Element {
    return (
        <>
            <Navegacao />
            <BoasVindas />
            <Rodape />
        </>
=======

function PHome(): JSX.Element {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navegacao /> 
            
            <main className="main-wrapper" style={{ flex: 1 }}>
                <BoasVindas />
            </main>

            <Rodape />
        </div>
>>>>>>> 66f4c7606323417193cd9d4d194b4353224875d1
    );
}

export default PHome;