import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const checkIfCancelled = () => {
    if (cancelled) {
      console.log('Operação cancelada');
      return true;
    }
    return false;
  };

  const createUser = async (data) => {
    if (checkIfCancelled()) return null;
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(user, { displayName: data.name });
      setLoading(false);
      return user;
    } catch (error) {
      setError(getErrorMessage(error));
      setLoading(false);
      return null;
    }
  };

  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
      return user;
    } catch (error) {
      setError(getErrorMessage(error));
      setLoading(false);
      return null;
    }
  };

  const logout = async () => {
    // Removido o checkIfCancelled para garantir que o logout sempre ocorra
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      setError('Erro ao fazer logout.');
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este email já está em uso.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    login,
    logout,
    error,
    loading,
  };
};