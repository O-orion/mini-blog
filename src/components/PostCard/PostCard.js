import React from 'react';
import { FaRegHeart, FaCommentAlt, FaRetweet } from 'react-icons/fa';
import styles from './postcard.module.css';

const PostCard = ({ post }) => {
  return (
    <div className={styles.postCard}>
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
      {post.tags?.length > 0 && (
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
  );
};

export default PostCard;