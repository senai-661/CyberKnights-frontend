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
            {
                label: 'Clientes',
                icon: 'pi pi-star',
                className: 'm-5 text-white text-lg',
                url: "/lista/cliente"
            },
            {
                label: 'Pedidos',
                icon: 'pi pi-star',
                className: 'm-5 text-white text-lg',
                url: "/lista/pedido"
            },
            {
                label: 'Produtos',
                icon: 'pi pi-star',
                className: 'm-5 text-white text-lg',
                url: "/lista/produto"
            }
        ] : [])
    ];

    const userActions = isAuthenticated ? (
        <div className="flex items- justify-end items-center mr-10 gap-4">
            <div className="flex flex-col pr-3">
                <p className="text-white font-semibold m-0">{nome}</p>
                <p className="text-white text-sm m-0">{email}</p>
            </div>
            <Avatar
              
                shape="circle"
                className="!w-[10%] !h-[10%]"
            />
            <button
                className="bg-white ml-6 text-slate-700 px-10 py-5 rounded border-none cursor-pointer flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors"
                onClick={AuthRequests.removeToken}
                style={{ height: '32px', fontSize: '14px' }}
            >
                <i className="pi pi-sign-out"></i>
                <span>Sair</span>
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