import React, { useState } from 'react';
import { db, auth } from '../../firebase/config'; // Removi 'storage', pois não será usado
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './createPost.module.css';

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Substituí 'image' por 'imageUrl'
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert('Você precisa estar logado para postar!');
      return;
    }

    if (!text.trim()) {
      alert('Escreva algo para compartilhar!');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        title: title.trim() || 'Sem título',
        text: text,
        imageUrl: imageUrl.trim(), // Salva a URL diretamente
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
      });
      setTitle('');
      setText('');
      setImageUrl(''); // Limpa o campo de URL
      setTags('');
      setIsOpen(false);

    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar o post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.createButton}>
        Novo Post
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>×</button>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional)"
                className={styles.titleInput}
                disabled={loading}
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva sua poesia, citação ou pensamento..."
                className={styles.textarea}
                rows="6"
                disabled={loading}
              />
              <input
                type="text" // Mudado de 'file' para 'text'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Cole o link da imagem (opcional)"
                className={styles.titleInput} // Nova classe para estilizar
                disabled={loading}
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (separadas por vírgula, ex: poesia, amor)"
                className={styles.tagsInput}
                disabled={loading}
              />
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;