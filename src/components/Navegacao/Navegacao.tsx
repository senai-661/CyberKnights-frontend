import { useState, type JSX } from "react";
import { Menubar } from 'primereact/menubar';
import type { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import AuthRequests from "../../fetch/AuthRequests";

interface CustomMenuItem extends MenuItem {
    badge?: number;
    shortcut?: string;
    items?: CustomMenuItem[];
}

function Navegacao(): JSX.Element {
    const [isAuthenticated] = useState(() => {
        const isAuth = localStorage.getItem('isAuth');
        const token = localStorage.getItem('token');
        return !!(isAuth && token && AuthRequests.checkTokenExpiry());
    });
    const navigate = useNavigate();

    const nome = localStorage.getItem('nome') || 'Usuário';
    const email = localStorage.getItem('email') || '';
  

    const items: CustomMenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            className: 'm-5 text-white text-lg',
            url: "/"
        },
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

    const start = (
        <img
            alt="logo"
            src='./src/assets/logo.png'
            height="100"
            // className="h-20 p-3 ml-10 mr-5 h-[7rem]"
            className="w-[40%] max-w-[40%] ml-10"
        />
    );

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
               className="bg-orange-300 font-bold text-white px-10 py-5 mr-10 rounded border-none cursor-pointer flex items-center justify-center gap-1 hover:bg-orange-400 transition-colors"
                onClick={AuthRequests.removeToken}
                style={{ height: '32px', fontSize: '14px' }}
            >
                <i className="pi pi-sign-out"></i>
                <span>Sair</span>
            </button>
        </div>
    ) : (
        <button
          className="bg-orange-300 ml-6 text-white px-10 py-5 rounded border-none cursor-pointer flex items-center justify-center gap-1 hover:bg-orange-400 transition-colors"
            onClick={() => navigate('/login')}
            style={{ height: '32px', fontSize: '14px' }}
        >
            <i className="pi pi-sign-in"></i>
            <span>Login</span>
        </button>
    );

    return (
        <header className="card h-[12vh] bg-orange-300 flex items-center px-4">
            <div className="flex-1">
                <Menubar
                    model={items}
                    start={start}
                />
            </div>
            {userActions}
        </header>
    );
}

export default Navegacao;