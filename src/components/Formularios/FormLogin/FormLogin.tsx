import { type JSX, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthRequests from '../../../fetch/AuthRequests';
import styles from './FormLogin.module.css';

function LoginForm(): JSX.Element {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    interface LoginData {
        email: string;
        senha: string;
    }

    interface FormEvent {
        preventDefault: () => void;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            alert("O e-mail é obrigatório.");
            return;
        }

        if (!senha.trim()) {
            alert("A senha é obrigatória.");
            return;
        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {
            alert("Digite um e-mail válido.");
            return;
        }

        const login: LoginData = {
            email: email.trim(),
            senha: senha
        };

        try {
            if (await AuthRequests.login(login)) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error(`Erro ao tentar fazer login: ${error}`);

            const message = error instanceof Error
                ? error.message
                : 'Erro ao fazer login';

            alert(`Falha no login: ${message}`);
        }
    };

    return (
        <div className={styles.loginFormContainer}>
            <div className={styles.loginForm}>
                <div className={styles.loginBrand}>Lanches<span>Maga</span></div>
                <h2 className={styles.loginHeader}>
                    Área do cliente
                </h2>
                <p className={styles.loginSubtitle}>
                    Bem-vindo de volta! Acesse sua conta.
                </p>

                <form onSubmit={handleSubmit} className={styles.loginFields}>
                    <div className={styles.formGroup}>
                        <label>
                            E-mail
                        </label>
                        <input
                            type="email"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.passwordHeader}>
                            <label>
                                Senha
                            </label>
                        </div>
                        <input
                            type="password"
                            placeholder="Sua senha segura"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginButton}>Entrar na sua conta</button>
                </form>

                <p className={styles.loginFooter}>
                    Ainda não tem conta?{' '}
                    <Link to="/cadastro/cliente">Cadastre-se grátis</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;