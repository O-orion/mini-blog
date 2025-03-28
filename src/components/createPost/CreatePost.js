import React, { useState } from 'react';
import { db, auth, storage } from '../../firebase/config'; // Ajuste o caminho se necessário
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './createPost.module.css'; // Vamos criar esse CSS

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
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
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        title: title.trim() || 'Sem título',
        text: text,
        imageUrl: imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Converte tags em array
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
      });
      setTitle('');
      setText('');
      setImage(null);
      setTags('');
      setIsOpen(false); // Fecha o modal
      alert('Post criado com sucesso!');
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
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className={styles.fileInput}
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