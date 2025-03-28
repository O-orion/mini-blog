import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config'; // Ajuste o caminho
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import PostCard from '../post/Post';
import styles from './listpost.module.css';

const ListPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log('Iniciando busca de posts na home...');
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        console.log('Snapshot recebido, número de documentos:', snapshot.docs.length);
        const postsData = await Promise.all(
          snapshot.docs.map(async (postDoc) => {
            const postData = { id: postDoc.id, ...postDoc.data() };
            console.log('Post encontrado:', postData);

            // Buscar foto de perfil do usuário
            const userDocRef = doc(db, 'users', postData.userId);
            const userDoc = await getDoc(userDocRef);
            const profilePicture = userDoc.exists() ? userDoc.data().profilePicture || '' : '';
            console.log('Foto de perfil para userId', postData.userId, ':', profilePicture);

            return { ...postData, profilePicture };
          })
        );
        console.log('Posts processados:', postsData);
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao buscar posts ou fotos de perfil:', error);
      }
    }, (error) => {
      console.error('Erro no onSnapshot:', error);
    });

    return () => {
      console.log('Desmontando ListPost, cancelando subscription.');
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} profilePicture={post.profilePicture} />
        ))
      ) : (
        <p className={styles.noPosts}>Nenhum post para exibir ainda...</p>
      )}
    </div>
  );
};

export default ListPost;