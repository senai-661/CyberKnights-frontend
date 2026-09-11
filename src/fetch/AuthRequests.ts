/**
 * Classe para lidar com autenticação
 */
class AuthRequests {

    private serverUrl: string;
    private endpointLogin: string;

    private decodeJwtPayload(token: string): { exp?: number } | null {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
            const binary = atob(padded);
            const json = decodeURIComponent(
                Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')
            );

            return JSON.parse(json);
        } catch {
            return null;
        }
    }
    
    /**
     * Construtor das rotas e do endereço do servidor
     */
    constructor() {
        // endereço do servidor
        this.serverUrl = 'http://localhost:3333';
        // rota do servidor
        this.endpointLogin = '/api/login';
    }

    /**
     * Realiza a autenticação no servidor
     * @param {*} login - email e senha
     * @returns **true** caso sucesso, **false** caso erro
     */
    async login(login: { email: string, senha: string}) {       
        try {
            const payload = {
                email: login.email,
                senha: login.senha,
                password: login.senha,
                username: login.email,
            };

            const response = await fetch(`${this.serverUrl}${this.endpointLogin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseText = await response.text();
            let data: any;

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                data = { message: responseText };
            }

            if (!response.ok) {
                const message = data?.message || data?.error || `Falha no login (${response.status})`;
                console.error('Erro na autenticação', response.status, data);
                throw new Error(message);
            }

            const auth = data?.auth ?? data?.authenticated ?? data?.status === 'success';
            const token = data?.token ?? data?.access_token ?? data?.jwt;
            const usuario = data?.usuario ?? data?.user ?? data?.userData ?? {};

            if (!auth) {
                const message = data?.message || data?.error || 'Autenticação negada pelo servidor';
                throw new Error(message);
            }

            if (!token) {
                throw new Error('Token de autenticação não recebido do servidor');
            }

            this.persistToken(token, usuario, auth);

            return true;
        } catch (error) {
            console.error('Erro: ', error);
            throw error;
        }
    }

    /**
     * Persiste o token no localStorage
     * @param {*} token - token recebido do servidor
     * @param {*} usuario - objeto com informações do usuário vindos do servidor
     * @param {*} isAuth - estado da autenticação do usuário
     */
    persistToken(token: string, usuario: {id_usuario: number, nome: string, email: string, role: string}, isAuth: boolean) {
        localStorage.setItem('token', token);
        localStorage.setItem('nome', usuario.nome);
        localStorage.setItem('idUsuario', usuario.id_usuario.toString());
        localStorage.setItem('email', usuario.email);
        localStorage.setItem('role', usuario.role);
        localStorage.setItem('isAuth', isAuth.toString());
    }

    /**
     * Remove as informações do localStorage
     */
    removeToken() {
        const keys = [
            'token',
            'nome',
            'idUsuario',
            'email',
            'role',
            'isAuth'
        ];

        keys.map(key => localStorage.removeItem(key));
        window.location.href = `/login`;
    }

    /**
     * Verifica a validade do token
     * @returns **true** caso token válido, **false** caso token inválido
     */
    checkTokenExpiry() {
        const token = localStorage.getItem('token');

        if (!token) return false;

        const payload = this.decodeJwtPayload(token);
        if (!payload || typeof payload.exp !== 'number') {
            this.removeToken();
            return false;
        }

        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            this.removeToken();
            return false;
        }

        return true;
    }
}

export default new AuthRequests();