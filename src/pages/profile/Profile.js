import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from './profile.module.css';
import PostCard from '../../components/post/Post';
import ProfilePicture from '../../components/profilePicture/ProfilePicture';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const initialData = {
            name: user.displayName || 'Anônimo',
            email: user.email,
            profilePicture: '',
            title: 'Poeta Iniciante',
            tags: [],
            totalLikes: 0,
            badges: [],
          };
          await setDoc(userDocRef, initialData);
          setUserData(initialData);
        }
      } catch (error) {
        console.error('Erro ao buscar/criar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    const q = query(collection(db, 'posts'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(userPosts);
    });

    fetchUserData();
    return () => unsubscribe();
  }, [user]);

  const handleImageSave = async (imageUrl) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { profilePicture: imageUrl }, { merge: true });
      setUserData((prev) => ({ ...prev, profilePicture: imageUrl }));
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      alert('Erro ao atualizar a foto de perfil: ' + error.message);
    }
  };

  const handleTagsUpdate = async () => {
    if (!user || !tagsInput.trim()) return;
    try {
      const newTags = tagsInput.split(',').map((tag) => tag.trim()).filter((tag) => tag);
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { tags: newTags }, { merge: true });
      setUserData((prev) => ({ ...prev, tags: newTags }));
      setTagsInput('');
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
    }
  };

  if (loading || !user) return <p>Carregando...</p>;
  if (!userData) return <p>Dados do usuário não carregados...</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div onClick={() => setIsModalOpen(true)}>
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt="Foto de perfil" className={styles.profileImg} />
          ) : (
            <div className={styles.placeholder}>Sem foto</div>
          )}
        </div>
        <div>
          <h1 className={styles.userName}>{userData.name}</h1>
          <p className={styles.userTitle}>{userData.title}</p>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>

      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{userData.totalLikes}</span>
          <span className={styles.statLabel}>Likes</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{posts.length}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Tags</h2>
        <div className={styles.tags}>
          {userData.tags && userData.tags.length > 0 ? (
            userData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>#{tag}</span>
            ))
          ) : (
            <p className={styles.noContent}>Nenhuma tag adicionada.</p>
          )}
        </div>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Adicione tags (ex: poesia, amor)"
          className={styles.input}
        />
        <button onClick={handleTagsUpdate} className={styles.actionButton}>
          Atualizar Tags
        </button>
      </div>

      <div className={styles.section}>
        <h2>Meus Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              profilePicture={userData.profilePicture}
            />
          ))
        ) : (
          <p className={styles.noContent}>Nenhum post criado ainda.</p>
        )}
      </div>

      {isModalOpen && (
        <ProfilePicture
          onClose={() => setIsModalOpen(false)}
          onSave={handleImageSave}
        />
      )}
    </div>
  );
};

export default Profile;