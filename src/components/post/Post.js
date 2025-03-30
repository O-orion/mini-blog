import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação
import { db, auth } from '../../firebase/config';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styles from './post.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { FaCommentAlt } from 'react-icons/fa';

const PostCard = ({ post, profilePicture, userName }) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (liked) return;
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, { likes: increment(1) });
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

  const handleOpenPost = () => {
    navigate(`/post/${post.id}`);
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
      <div className={styles.content} onClick={handleOpenPost}>
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
        <button onClick={handleLike} disabled={liked} className={styles.action_text} >
          <FaRegHeart color={liked ? '#FF8A80' : '#fff'} size={16} />
          <span>{post.likes}</span>
        </button>
        <button  onClick={handleOpenPost} className={styles.action_text} ><FaCommentAlt color="#fff" size={16} /> <span>{post.comments}</span></button>
        <button className={ styles.action_text } onClick={handleRepost} disabled={reposted}>
          <FaRepeat color={reposted ? '#FFE0B2' : '#fff'} size={16} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;