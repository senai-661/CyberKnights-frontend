import { useState, type JSX } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import AuthRequests from "../../fetch/AuthRequests";
import logoMaga from "../../assets/ChatGPT Image 2 de set. de 2026, 13_59_46.png";

function Navegacao(): JSX.Element {
    const [isAuthenticated] = useState(() => {
        const isAuth = localStorage.getItem('isAuth');
        const token = localStorage.getItem('token');
        return !!(isAuth && token && AuthRequests.checkTokenExpiry());
    });
    const navigate = useNavigate();
    const location = useLocation();

    const nome = localStorage.getItem('nome') || 'Usuário';
    const email = localStorage.getItem('email') || '';

    const items = [
        { label: 'Home', icon: 'pi pi-home', url: "/" },
        ...(isAuthenticated ? [
            { label: 'Clientes', icon: 'pi pi-users', url: "/lista/cliente" },
            { label: 'Pedidos', icon: 'pi pi-shopping-bag', url: "/lista/pedido" },
            { label: 'Produtos', icon: 'pi pi-hamburger', url: "/lista/produto" }
        ] : [])
    ];

    const userActions = isAuthenticated ? (
        <div className="user-actions">
            <div className="user-avatar"><i className="pi pi-user"></i></div>
            <div className="user-details"><strong>{nome}</strong><span>{email}</span></div>
            <button className="logout-button" onClick={AuthRequests.removeToken} type="button">
                <i className="pi pi-sign-out"></i><span>Sair</span>
            </button>
        </div>
    ) : (
        <button className="login-button" onClick={() => navigate('/login')} type="button">
            <i className="pi pi-sign-in"></i><span>Login</span>
        </button>
    );

    return (
        <header className="topbar">
            <div className="topbar-inner">
                <button className="brand-logo" onClick={() => navigate('/')} type="button" aria-label="Ir para o início">
                    <img src={logoMaga} alt="Lanches Maga" />
                </button>
                <nav className="main-nav" aria-label="Menu principal">
                    {items.map((item) => (
                        <button className={`nav-item ${location.pathname === item.url ? 'is-active' : ''}`} key={item.label} onClick={() => navigate(item.url)} type="button">
                            {item.label === 'Produtos' ? <span className="hamburger-icon" aria-hidden="true">🍔</span> : <i className={item.icon}></i>}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                {userActions}
            </div>
        </header>
    );
}

export default Navegacao;