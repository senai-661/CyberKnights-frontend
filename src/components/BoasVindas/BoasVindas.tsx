import { type JSX } from "react";
import logoMaga from "../../assets/ChatGPT Image 2 de set. de 2026, 13_59_46.png";

function BoasVindas(): JSX.Element {
    return (
<<<<<<< HEAD
        <section style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            gap: '2rem',
            minHeight: '70vh',
            backgroundColor: '#fff132'
        }}>
            {/* Lado Esquerdo: Textos */}
            <div style={{ flex: 1, textAlign: 'left' }}>
                <h1 style={{
                    color: '#000',
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem'
                }}>
                    Bem-vindos ao <span style={{ color: '#000' }}>Lanches Maga</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: '#000000',
                    lineHeight: '1.6',
                    maxWidth: '500px'
                }}>
                    Lanches artesanais feitos com ingredientes frescos e muito sabor
                    <strong> com total segurança. </strong>
                </p>

                <p style={{
                    color: '#000000',
                    marginTop: '1.5rem',
                    fontSize: '1.1rem'
                }}>
                    Os melhores lanches para você.
                </p>
            </div>

            {/* Lado Direito: Imagem */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <img
                    src="/src/assets/lanche.png"
                    alt="Lanches Maga"
                    style={{
                        width: '250px',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '20px',
                        opacity: 0.7,
                    }}
                />
=======
        <section className="hero-shell">
            <div className="hero-copy">
                <h1>Bem-vindo ao <span>Lanches Maga</span></h1>
                <p>Lanches artesanais feitos com ingredientes frescos e muito sabor.</p>
                <p className="hero-subtitle">Os melhores lanches para você.</p>
                <button className="hero-button" type="button">Faça seu pedido agora <span>›</span></button>
            </div>
            <div className="hero-image-wrap">
                <img className="hero-image" src={logoMaga} alt="Lanches Maga" />
>>>>>>> a684f86 (nova funcionalidade atualizar)
            </div>

        </section>
    );
}

export default BoasVindas;

/*kjgyufytfytdtdyuguywgiuwgeryawgrterkuytaekyufgkiurthawiuyrkiwery*/