import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './profile.module.css';
import PostCard from '../../components/post/Post';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [tagsInput, setTagsInput] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
  
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
  
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        updateUserLikes(totalLikes);
      }, (error) => {
        console.error('Erro ao buscar posts:', error);
      });
  
      fetchUserData();
      return () => unsubscribe();
    }, [user]);
  
    const updateUserLikes = async (totalLikes) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { totalLikes }, { merge: true });
        setUserData((prev) => ({ ...prev, totalLikes }));
      } catch (error) {
        console.error('Erro ao atualizar likes:', error);
      }
    };
  
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file || !user) return;
  
      setUploading(true);
      try {
        const imageRef = ref(storage, `profilePictures/${user.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(uploadResult.ref);
  
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { profilePicture: imageUrl }, { merge: true });
        
        // Atualizar o estado imediatamente
        setUserData((prev) => ({ ...prev, profilePicture: imageUrl }));
        console.log('Foto de perfil atualizada com sucesso:', imageUrl);
      } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        alert('Erro ao atualizar a foto de perfil: ' + error.message);
      } finally {
        setUploading(false);
        setProfilePicture(null); // Limpar o input de arquivo
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
  
    const getTitle = (likes) => {
      if (likes >= 50) return 'Voz da Alma';
      if (likes >= 20) return 'Eco Poético';
      return 'Poeta Iniciante';
    };
  
    const getBadges = (likes, postCount) => {
      const badges = [];
      if (postCount > 0) badges.push('Primeiro Post');
      if (likes >= 10) badges.push('10 Likes');
      if (likes >= 50) badges.push('Mestre das Palavras');
      return badges;
    };
  
    if (loading || !user) return <p className={styles.loading}>Carregando...</p>;
    if (!userData) return <p className={styles.loading}>Dados do usuário não carregados...</p>;
  
    const updatedTitle = getTitle(userData.totalLikes);
    const updatedBadges = getBadges(userData.totalLikes, posts.length);
  
    if (updatedTitle !== userData.title || updatedBadges.join() !== userData.badges.join()) {
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, { title: updatedTitle, badges: updatedBadges }, { merge: true });
      setUserData((prev) => ({ ...prev, title: updatedTitle, badges: updatedBadges }));
    }
  
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profilePicture}>
            {userData.profilePicture ? (
              <img src={userData.profilePicture} alt="Foto de perfil" className={styles.profileImg} />
            ) : (
              <div className={styles.placeholder}>
                <span>Sem foto</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.uploadInput}
              id="profilePictureUpload"
              disabled={uploading}
            />
            <label htmlFor="profilePictureUpload" className={styles.uploadButton}>
              {uploading ? 'Carregando...' : 'Alterar Foto'}
            </label>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{userData.name}</h1>
            <p className={styles.userTitle}>{updatedTitle}</p>
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
  
        <div className={styles.profileContent}>
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
            <h2>Medalhas</h2>
            <div className={styles.badges}>
              {userData.badges && userData.badges.length > 0 ? (
                userData.badges.map((badge, index) => (
                  <span key={index} className={styles.badge}>{badge}</span>
                ))
              ) : (
                <p className={styles.noContent}>Nenhuma medalha conquistada.</p>
              )}
            </div>
          </div>
  
          <div className={styles.section}>
            <h2>Meus Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} profilePicture={userData.profilePicture} />
              ))
            ) : (
              <p className={styles.noContent}>Nenhum post ainda.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;