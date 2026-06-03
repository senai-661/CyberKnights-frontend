<<<<<<< HEAD
import { useState } from "react";
import styles from "../../components/Formularios/FormLogin.module.css";

export default function PLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Senha:", senha);
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: "center" }}>
        Login
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}
=======
import { type JSX } from "react";

import Navegacao from "../../components/Navegacao/Navegacao";

import LoginForm from "../../components/FormLogin/FormLogin";


function PLogin(): JSX.Element {
    return (
        <div className="pagina-grid">
      
            <Navegacao />


            <LoginForm />
        </div>
    );
}

export default PLogin;
>>>>>>> 66f4c7606323417193cd9d4d194b4353224875d1
