import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useState, useEffect } from 'react';

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  function checkIfCancelled() {
    if (cancelled) {
      return true;
    }
    return false;
  }

  const createUser = async (data) => {
    if (checkIfCancelled()) {
      console.log("Operação cancelada");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log("Usuário criado com sucesso:", user);

      await updateProfile(user, {
        displayName: data.name,
      });

      console.log("Perfil atualizado com sucesso, user:", user);

      setLoading(false);
      return user;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = "Ocorreu um erro ao criar o usuário.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso.";
      } else if (error.code === "auth/weak-password") {
        console.log('AQUI')
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      }
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
  };
};