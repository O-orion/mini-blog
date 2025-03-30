import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config'; // Importe sua configuração do Firebase
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import styles from './siderbarright.module.css';

const SiderBarRight = () => {
  const [recommendedAuthors, setRecommendedAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar usuários e filtrar recomendações
  const fetchRecommendations = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('Nenhum usuário logado');
        setLoading(false);
        return;
      }

      // Busca todos os usuários do Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Busca os dados do usuário atual para verificar quem ele segue
      const currentUserDoc = allUsers.find((user) => user.id === currentUser.uid);
      const following = currentUserDoc?.following || [];

      // Filtra usuários que o usuário atual ainda não segue e exclui ele mesmo
      const filteredUsers = allUsers.filter(
        (user) => user.id !== currentUser.uid && !following.includes(user.id)
      );

      // Limita a 6 recomendações (ou ajuste conforme necessário)
      const limitedRecommendations = filteredUsers.slice(0, 6);
      setRecommendedAuthors(limitedRecommendations);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para seguir um usuário
  const handleFollow = async (authorId, authorName) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Atualiza o campo 'following' do usuário atual no Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        following: arrayUnion(authorId), // Adiciona o ID ao array 'following'
      });

      // Remove o usuário seguido da lista de recomendações
      setRecommendedAuthors((prev) =>
        prev.filter((author) => author.id !== authorId)
      );

      alert(`Você começou a seguir ${authorName}!`);
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
    }
  };

  // Carrega as recomendações ao montar o componente
  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return <aside className={styles.sidebarRight}>Carregando...</aside>;
  }

  return (
    <aside className={styles.sidebarRight}>
      <h3>Autores</h3>
      <p>Conheça outros autores.</p>

      {recommendedAuthors.length > 0 ? (
        recommendedAuthors.map((author) => (
          <div key={author.id} className={styles.container}>
            <div className={styles.infos}>
              <img
                className={styles.image}
                src={author.profilePicture || 'https://via.placeholder.com/50'}
                alt={`Foto de ${author.name}`}
              />
              <p>{author.name}</p>
            </div>
            <button onClick={() => handleFollow(author.id, author.name)}>
              Seguir
            </button>
          </div>
        ))
      ) : (
        <p>Nenhuma recomendação disponível.</p>
      )}
    </aside>
  );
};

export default SiderBarRight;