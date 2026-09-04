import { type JSX } from "react";
import { useNavigate } from "react-router-dom";
import logoMaga from "../../assets/logo.png";

function BoasVindas(): JSX.Element {
    const navigate = useNavigate();

    return (
        <section className="welcome-page">
            <div className="hero-shell">
                <div className="hero-panel">
                    <div className="hero-copy">
                        <p className="hero-eyebrow">LANCHES ARTESANAIS</p>
                        <h1>Bem-vindo ao <span>Lanches Maga!</span></h1>
                        <p>Lanches artesanais feitos com ingredientes frescos e muito sabor.</p>
                        <button className="hero-button" type="button" onClick={() => navigate('/cadastro/pedido')}>
                            Faça seu pedido agora <span aria-hidden="true">›</span>
                        </button>
                    </div>
                    <div className="hero-image-wrap">
                        <img className="hero-logo" src={logoMaga} alt="Logo Lanches Maga" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BoasVindas;