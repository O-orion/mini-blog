import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import styles from './navegar.module.css';
import SiderBar from '../../components/siderBar/SiderBar';
import SiderBarRight from '../../components/siderBarRight/SiderBarRight';
import { FaRegHeart, FaCommentAlt, FaRetweet } from 'react-icons/fa';

const Navegar = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('todos');

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredPosts =
        filter === 'todos'
          ? postsData
          : postsData.filter((post) => post.type === filter);

      setPosts(filteredPosts);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  return (
    <div className={styles.container}>
      <SiderBar />
      <main className={styles.main}>
        <div className={styles.filters}>
          <button
            className={filter === 'todos' ? styles.activeFilter : ''}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
          <button
            className={filter === 'texto' ? styles.activeFilter : ''}
            onClick={() => setFilter('texto')}
          >
            Texto
          </button>
          <button
            className={filter === 'foto' ? styles.activeFilter : ''}
            onClick={() => setFilter('foto')}
          >
            Fotos
          </button>
          <button
            className={filter === 'video' ? styles.activeFilter : ''}
            onClick={() => setFilter('video')}
          >
            Vídeos
          </button>
        </div>

        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <h3>{post.title}</h3>
              {post.text && <p>{post.text}</p>}
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className={styles.postImage} />
              )}
              {post.videoUrl && (
                <video controls className={styles.postVideo}>
                  <source src={post.videoUrl} type="video/mp4" />
                </video>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.actions}>
                <span className={styles.actionItem}>
                  <FaRegHeart /> {post.likes || 0} 
                </span>
                <span className={styles.actionItem}>
                  <FaCommentAlt /> {post.comments || 0} 
                </span>
                <span className={styles.actionItem}>
                  <FaRetweet /> {post.reposts || 0} 
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Navegar;