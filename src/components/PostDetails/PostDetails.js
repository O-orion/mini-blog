import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, collection, query, onSnapshot, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import styles from './postdetails.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaReply } from 'react-icons/fa';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // Para respostas

  useEffect(() => {
    // Carregar dados do post
    const fetchPost = async () => {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        const userRef = doc(db, 'users', postData.userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        setPost({
          ...postData,
          userName: userData.name || 'Anônimo',
          profilePicture: userData.profilePicture || '',
        });
      }
    };

    // Carregar comentários em tempo real
    const q = query(collection(db, 'posts', postId, 'comments'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = await Promise.all(
        snapshot.docs.map(async (commentDoc) => {
          const commentData = { id: commentDoc.id, ...commentDoc.data() };
          const userRef = doc(db, 'users', commentData.userId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          return {
            ...commentData,
            userName: userData.name || 'Anônimo',
            profilePicture: userData.profilePicture || '',
          };
        })
      );
      setComments(commentsData);
    });

    fetchPost();
    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !newComment.trim()) return;
    try {
      const commentData = {
        userId: auth.currentUser.uid,
        text: newComment,
        createdAt: serverTimestamp(),
        likes: 0,
        parentId: replyTo || null, // Se for resposta, inclui o ID do comentário pai
      };
      await addDoc(collection(db, 'posts', postId, 'comments'), commentData);
      setNewComment('');
      setReplyTo(null);
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { comments: increment(1) });
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, { likes: increment(1) });
    } catch (error) {
      console.error('Erro ao dar like no comentário:', error);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  if (!post) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Voltar</button>
      <div className={styles.postSection}>
        <div className={styles.postHeader}>
          <img src={post.profilePicture} alt="Foto de perfil" className={styles.avatar} />
          <p className={styles.userName}>{post.userName}</p>
          {post.isRepost && <span className={styles.repostLabel}>Repost</span>}
        </div>
        <div className={styles.postContent}>
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
      </div>
      <div className={styles.commentsSection}>
        <h4>Comentários</h4>
        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? 'Escreva sua resposta...' : 'Adicione um comentário...'}
            className={styles.commentInput}
          />
          <button type="submit" className={styles.commentButton}>
            {replyTo ? 'Responder' : 'Enviar'}
          </button>
          {replyTo && (
            <button onClick={() => setReplyTo(null)} className={styles.cancelReply}>
              Cancelar
            </button>
          )}
        </form>
        <div className={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <img src={comment.profilePicture} alt="Foto" className={styles.commentAvatar} />
                  <p className={styles.commentUser}>{comment.userName}</p>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
                <div className={styles.commentActions}>
                  <button onClick={() => handleLikeComment(comment.id)}>
                    <FaRegHeart color="#FF8A80" size={14} /> {comment.likes}
                  </button>
                  <button onClick={() => handleReply(comment.id)}>
                    <FaReply color="#FFE0B2" size={14} /> Responder
                  </button>
                </div>
                {comment.parentId && (
                  <p className={styles.replyLabel}>Resposta a outro comentário</p>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noComments}>Nenhum comentário ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;