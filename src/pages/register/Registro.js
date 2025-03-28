import React from 'react';
import { useState } from 'react';
import styles from './styles.module.css';
import { useAuthentication } from '../../hooks/useAuthentication';

function Registro() {
  const { createUser, error: authError, loading } = useAuthentication();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erros, setErros] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Adicionado para sucesso

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros("");
    setSuccessMessage("");

    console.log("handleSubmit chamado");

    const user = {
      name,
      email,
      password,
    };

    if (password !== confirmPassword) {
      setErros("As senhas precisam ser iguais");
      return;
    }

    const res = await createUser(user);
    console.log("Resultado de createUser:", res);

    if (res) {
      console.log("Usuário criado:", res);
      setSuccessMessage("Usuário registrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      console.log("Falha no registro, res é null. Erro do hook:", authError);
      if (!authError) setErros("Erro desconhecido ao registrar. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Cadastre-se para Postar</h2>
      <p>Crie seu usuário e compartilhe suas histórias!</p>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Nome do Usuário"
          />
        </label>

        <label>
          <span>Email:</span>
          <input
            type="email"
            required
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>Senha:</span>
          <input
            type="password"
            required
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          <span>Confirme a Senha:</span>
          <input
            type="password"
            required
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Registrar"}
        </button>
        {erros && <p className={styles.error}>{erros}</p>}
        {authError && <p className={styles.error}>{authError}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default Registro;