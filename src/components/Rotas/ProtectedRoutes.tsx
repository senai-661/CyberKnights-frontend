import { Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import AuthRequests from '../../fetch/AuthRequests';

interface ProtectedRouteProps {
    element: ReactElement;
}

/**
 * Lida com a ção das rotas
 * A ção previne o acesso não autorizado a rotas privadas, evitando também que a aplicação quebre.
 * 
 * A função recebe o elemento que será renderizado. Caso o usuário esteja autenticado, o elemento é renderizado, caso contrário, o usuário é redirecionado para a página de login.
 * 
 * @param element - elemento que será renderizado
 * @returns Elemento renderizado caso o usuário esteja autenticado, caso contrário, redireciona para a página de login
 */
const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem('isAuth') === 'true' && AuthRequests.checkTokenExpiry();

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;