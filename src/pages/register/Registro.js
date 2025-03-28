import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

function Registro() {

    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setpassword ] = useState();
    const [ confirmPassword, setConfirmPassword ] = useState();
    const [ erros, seterros ] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        seterros("")

        const user = {
            name,
            email, 
            password
        };

        if ( password !== confirmPassword) {
            seterros("As senhas precisam ser iguais");
            return;
        }

    }

  return (
    <div className={styles.container}>
      <h2>Cadastre-se para Postar</h2>
      <p>Crie seu usuário e compartilhe suas histórias!</p>

      <form onSubmit={handleSubmit} >
        <label>
          <span>Nome:</span>
          <input value={name} onChange={(e) => setName(e.target.value)}  type="text" required placeholder="Nome do Usuário" />
        </label>

        <label>
          <span>Email:</span>
          <input type="email" required placeholder="Seu email"  value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          <span>Senha:</span>
          <input type="password" required placeholder="Sua senha" value={password} onChange={ (e) => setpassword(e.target.value)}  />
        </label>

        <label>
          <span>Confirme a Senha:</span>
          <input type="password" required placeholder="Confirme sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}  />
        </label>

        <button type='submit'>Registrar</button>
        {
            erros &&  <p className={ styles.error } >{erros}</p>
            
        }
      </form>
    </div>
  );
}

export default Registro;