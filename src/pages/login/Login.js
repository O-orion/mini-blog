import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para redirecionamento
import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuthentication();
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };
    const user = await login(userData);

    if (user) {
      console.log('Login bem-sucedido:', user);
      navigate('/'); // Redireciona para a home
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        My<span>Poems</span>
      </h2>
      <p className={styles.subtitle}>Desvende os segredos da sua alma</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>E-mail</span>
          <input
            className={styles.input}
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          <span>Senha</span>
          <input
            className={styles.input}
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <p className={styles.registerLink}>
        Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
      </p>
    </div>
  );
};

export default Login;