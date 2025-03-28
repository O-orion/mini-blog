import React from 'react'
import styles from './post.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";

const PostCard = ({ post, profilePicture }) => {
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
        <p className={styles.username}>Anônimo</p>
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
        <button><FaRegHeart color="#fff" size={16} /></button>
        <button><FaCommentAlt color="#fff" size={16} /></button>
        <button><FaRepeat color="#fff" size={16} /></button>
      </div>
    </div>
  );
};

export default PostCard;