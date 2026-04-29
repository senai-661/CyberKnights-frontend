import { type JSX } from "react";
import "./Rodape.css";

function Rodape(): JSX.Element {
    return (
        <footer className="rodape-container">
            <div className="rodape-content">
                {/* Lado Esquerdo: Marca */}
                <div className="rodape-info">
                    <h3>
                        <i className="pi pi-heart-fill" style={{ color: '#10b981' }}></i>
                        Bem-vindo ao lanches maga
                    </h3>
                    <p>
                       Lanches artesanais feitos com ingredientes frescos e muito sabor
                    </p>
                </div>

                {/* Centro: Equipe de Desenvolvimento */}
                <div className="rodape-links">
                    <h4>Desenvolvido por</h4>
                    <div className="equipe-lista">
                        <span>lavinia</span> • 
                        <span>Beatriz</span> • 
                        <span>Heloisa</span> • 
                        <span>Sophia</span> • 
                        <span>Clara</span>
                    </div>
                </div>

                {/* Lado Direito: Localização */}
                <div className="rodape-links">
                    <h4>Localização</h4>
                    <p className="rodape-equipe">
                        <i className="pi pi-map-marker"></i> Sertãozinho - SP
                    </p>
                    <div className="social-icons">
                        <i className="pi pi-instagram"></i>
                        <i className="pi pi-linkedin"></i>
                        <i className="pi pi-facebook"></i>
                    </div>
                </div>
            </div>

            {/* Faixa de Copyright Final */}
            <div className="rodape-bottom">
                <p>© 2026 Mega Lanches - Rede de lanches .</p>
                <p>Versão 1.0.2</p>
            </div>
        </footer>
    );
}

export default Rodape;