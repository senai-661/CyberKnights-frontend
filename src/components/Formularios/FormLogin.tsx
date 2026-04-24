// Importa o tipo JSX do React para definir o tipo de retorno do componente
import { type JSX, useState } from 'react';// Importa os estilos CSS específicos para o formulário de login
import estilo from './FormLogin.module.css';
import AuthRequests from '../../fetch/AuthRequests';

// Declara o componente funcional LoginForm que retorna um elemento JSX
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
        const login: LoginData = { email: email, senha: senha }

        // lógica para autenticação do usuário
        try {
            if (await AuthRequests.login(login)) {
                window.location.href = '/'; // redireciona para a página inicial
            }
        } catch (error) {
            // lança um erro
            console.error(`Erro ao tentar fazer login: ${error}`);
            alert('Erro ao fazer login, verifique se usuário e/ou senha estão corretos.');
        }
    };

    return (
        // Seção principal que contém o formulário de login, com classe de estilo personalizada
        <section className={estilo['login-form-container']}>

            {/* Início do formulário com classe de estilo personalizada */}
            <form action="POST" className={estilo['login-form']} onSubmit={handleSubmit}>

                {/* Título do formulário */}
                <h2 className={estilo['login-header']}>LOGIN</h2>

                {/* Campo de e-mail com rótulo */}
                <div className={estilo['form-group']}>
                    <label>
                        E-mail
                        <input
                            type="email" // Define o tipo do input como e-mail
                            placeholder='Informe o seu email' // Texto de dica para o usuário
                            className={estilo['input-email-login']} // Classe CSS personalizada
                            value={email}  // valor digitado no campo
                            onChange={(e) => setEmail(e.target.value)}  // atualiza o valor conforme usuário digita
                            required  // campo obrigatório
                        />
                    </label>
                </div>

                {/* Campo de senha com rótulo */}
                <div className={estilo['form-group']}>
                    <label>
                        Senha
                        <input
                            type="password" // Define o tipo do input como senha
                            placeholder='Informe sua senha' // Texto de dica para o usuário
                            className={estilo['input-password-login']} // Classe CSS personalizada
                            value={senha}  // valor digitado no campo
                            onChange={(e) => setSenha(e.target.value)}  // atualiza o valor conforme usuário digita
                            required  // campo obrigatório
                        />
                    </label>
                </div>

                {/* Botão de login */}
                <input
                    type="submit" // Tipo botão (não envia o formulário por padrão)
                    value="Entrar" // Texto exibido no botão
                    className={estilo['login-button']} // Classe CSS personalizada
                />
            </form>
        </section>
    );
}

// Exporta o componente para ser utilizado em outros arquivos do projeto
export default LoginForm;