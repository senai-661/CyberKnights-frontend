/**
 * Classe para lidar com autenticação
 */
class AuthRequests {

    private serverUrl: string;
    private endpointLogin: string;

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }

    private textoDaResposta(data: Record<string, unknown>, fallback: string): string {
        const mensagem = data.message ?? data.error;
        return typeof mensagem === 'string' && mensagem.trim() ? mensagem : fallback;
    }

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
            let data: Record<string, unknown> = {};

            try {
                const parsed: unknown = responseText ? JSON.parse(responseText) : {};
                data = this.isRecord(parsed) ? parsed : { message: responseText };
            } catch {
                data = { message: responseText };
            }

            if (!response.ok) {
                const message = this.textoDaResposta(data, `Falha no login (${response.status})`);
                console.error('Erro na autenticação', response.status, data);
                throw new Error(message);
            }

            const authValue = data.auth !== undefined
                ? data.auth
                : data.authenticated !== undefined
                    ? data.authenticated
                    : data.status === 'success';
            const auth = Boolean(authValue || data.token || data.access_token || data.jwt);
            const token = data.token !== undefined
                ? data.token
                : data.access_token !== undefined
                    ? data.access_token
                    : data.jwt;
            const usuarioValor = data.usuario !== undefined
                ? data.usuario
                : data.user !== undefined
                    ? data.user
                    : data.userData;
            const usuario = this.isRecord(usuarioValor) ? usuarioValor : {};

            if (!auth) {
                throw new Error(this.textoDaResposta(data, 'Autenticação negada pelo servidor'));
            }

            if (!token) {
                throw new Error('Token de autenticação não recebido do servidor');
            }

            this.persistToken(String(token), usuario, Boolean(auth));

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
    persistToken(token: string, usuario: Record<string, unknown>, isAuth: boolean) {
        localStorage.setItem('token', token);
        localStorage.setItem('nome', String(usuario.nome ?? 'Usuário'));
        localStorage.setItem('idUsuario', String(usuario.id_usuario ?? usuario.id ?? ''));
        localStorage.setItem('email', String(usuario.email ?? ''));
        localStorage.setItem('role', String(usuario.role ?? ''));
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

        if (token.split('.').length !== 3) return true;

        const payload = this.decodeJwtPayload(token);
        if (!payload || typeof payload.exp !== 'number') return false;

        const now = Math.floor(Date.now() / 1000);

        if (payload.exp <= now) {
            this.removeToken();
            return false;
        }

        return true;
    }
}

export default new AuthRequests();
//kjhdfiuseghfisdgfjsrgfzujreuikdbwukeygfdwjratw//