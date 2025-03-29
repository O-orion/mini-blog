import React, { useState } from 'react';
import styles from './profilePicture.module.css';

const ProfilePictureModal = ({ onClose, onSave }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageUrl) {
      onSave(imageUrl);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h3>Alterar Foto de Perfil</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Cole o link da nova foto"
            className={styles.input}
          />
          <button type="submit" className={styles.saveButton}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureModal;