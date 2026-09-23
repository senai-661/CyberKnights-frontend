import { useState, type JSX, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthRequests from "../../../fetch/AuthRequests";
import Feedback from "../../Feedback/Feedback";
import styles from "./FormLogin.module.css";

function LoginForm(): JSX.Element {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    interface LoginData {
        email: string;
        senha: string;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro("");

        if (!email.trim()) {
            setErro("O e-mail é obrigatório.");
            return;
        }

        if (!senha.trim()) {
            setErro("A senha é obrigatória.");
            return;
        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {
            setErro("Digite um e-mail válido.");
            return;
        }

        const login: LoginData = {
            email: email.trim(),
            senha
        };

        try {
            setCarregando(true);
            const resposta = await AuthRequests.login(login);

            if (resposta) {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Erro capturado:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao fazer login";

            setErro(message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className={styles.loginFormContainer}>
            <div className={styles.loginForm}>
                <div className={styles.loginBrand}>
                    Lanches<span>Maga</span>
                </div>

                <h2 className={styles.loginHeader}>
                    Área do cliente
                </h2>

                <p className={styles.loginSubtitle}>
                    Bem-vindo de volta! Acesse sua conta.
                </p>

                {erro && <Feedback tipo="erro">{erro}</Feedback>}

                <form
                    onSubmit={handleSubmit}
                    className={styles.loginFields}
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="login-email">E-mail</label>

                        <input
                            id="login-email"
                            type="email"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.passwordHeader}>
                            <label htmlFor="login-senha">Senha</label>
                        </div>

                        <input
                            id="login-senha"
                            type="password"
                            placeholder="Sua senha segura"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoComplete="current-password"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar na sua conta"}

                    </button>
                </form>

                <p className={styles.loginFooter}>
                    Ainda não tem conta?{" "}
                    <Link to="/cadastro/cliente">
                        Cadastre-se grátis
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;