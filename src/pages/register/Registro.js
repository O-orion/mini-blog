import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para redirecionamento
import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './register.module.css';

const Register = () => {
  const { createUser, error: authError, loading } = useAuthentication();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erros, setErros] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros('');
    setSuccessMessage('');

    const user = {
      name,
      email,
      password,
    };

    if (password !== confirmPassword) {
      setErros('As senhas precisam ser iguais');
      return;
    }

    const res = await createUser(user);

    if (res) {
      console.log('Usuário criado:', res);
      setSuccessMessage('Usuário registrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/'); // Redireciona para a home após o registro
    } else {
      console.log('Falha no registro, res é null. Erro do hook:', authError);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Cadastre-<span>se</span>
      </h2>
      <p className={styles.subtitle}>Crie seu usuário e compartilhe suas histórias</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Seu nome"
            className={styles.input}
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          <span>E-mail</span>
          <input
            type="email"
            required
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          <span>Senha</span>
          <input
            type="password"
            required
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          <span>Confirme a Senha</span>
          <input
            type="password"
            required
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
        </label>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Carregando...' : 'Registrar'}
        </button>
        {erros && <p className={styles.error}>{erros}</p>}
        {authError && <p className={styles.error}>{authError}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
      <p className={styles.loginLink}>
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
};

export default Register;