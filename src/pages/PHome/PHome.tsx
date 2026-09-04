import type { JSX } from "react";
import BoasVindas from "../../components/BoasVindas/BoasVindas";
import Navegacao from "../../components/Navegacao/Navegacao";

function PHome(): JSX.Element {
    return (
        <div className="home-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navegacao /> 
            
            <main className="main-wrapper" style={{ flex: 1 }}>
                <BoasVindas />
            </main>

        </div>
    );
}

export default PHome;