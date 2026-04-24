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