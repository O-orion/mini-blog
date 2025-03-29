import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, onSnapshot, query } from 'firebase/firestore';
import styles from './post.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { FaCommentAlt } from 'react-icons/fa';

const PostCard = ({ post, profilePicture, userName }) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts', post.id, 'comments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleLike = async () => {
    if (liked) return;
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likes: increment(1),
      });
      setLiked(true);
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  const handleRepost = async () => {
    if (reposted || !auth.currentUser) return;
    try {
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        title: post.title,
        text: post.text,
        imageUrl: post.imageUrl,
        tags: post.tags,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        isRepost: true,
        originalPostId: post.id,
      });
      setReposted(true);
      alert('Post republicado com sucesso!');
    } catch (error) {
      console.error('Erro ao republicar:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !comment.trim()) return;
    try {
      await addDoc(collection(db, 'posts', post.id, 'comments'), {
        userId: auth.currentUser.uid,
        text: comment,
        createdAt: serverTimestamp(),
      });
      setComment('');
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        comments: increment(1), // Incrementa o contador de comentários
      });
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.avatar}>
          {profilePicture ? (
            <img src={profilePicture} alt="Foto de perfil" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarPlaceholder}></div>
          )}
        </div>
        <p className={styles.username}>{userName || 'Anônimo'}</p>
        {post.isRepost && <span className={styles.repostLabel}>Repost</span>}
      </div>
      <div className={styles.content}>
        <h3>{post.title}</h3>
        <p>{post.text}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="Post" className={styles.image} />}
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button onClick={handleLike} disabled={liked}>
          <FaRegHeart color={liked ? '#FF8A80' : '#fff'} size={16} />
          <span>{post.likes}</span>
        </button>
        <button><FaCommentAlt color="#fff" size={16} /> <span>{post.comments}</span></button>
        <button onClick={handleRepost} disabled={reposted}>
          <FaRepeat color={reposted ? '#FFE0B2' : '#fff'} size={16} />
        </button>
      </div>
      <div className={styles.commentsSection}>
        <form onSubmit={handleComment}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className={styles.commentInput}
          />
          <button type="submit" className={styles.commentButton}>Enviar</button>
        </form>
        {comments.length > 0 && (
          <div className={styles.commentsList}>
            {comments.map((c) => (
              <p key={c.id} className={styles.comment}>{c.text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;