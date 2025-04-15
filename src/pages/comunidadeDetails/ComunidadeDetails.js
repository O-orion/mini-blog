import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../components/siderBar/SiderBar';
import styles from './comunidadeDetails.module.css';
import { FaRegHeart, FaCommentAlt, FaPlus } from 'react-icons/fa';

// Dados fictícios para simulação (substitua por Firebase)
const MOCK_COMMUNITIES = {
  '1': {
    name: 'Amantes da Natureza',
    description: 'Um espaço para explorar a beleza do mundo natural, compartilhar fotos e dicas sobre trilhas e conservação.',
    members: 1200,
    likes: 450,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    posts: [
      {
        id: 'p1',
        title: 'Trilha na Serra',
        content: 'Uma experiência incrível na natureza!',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        likes: 25,
        comments: 8,
      },
      {
        id: 'p2',
        title: 'Flores do Campo',
        imageUrl: 'https://images.unsplash.com/photo-1476994230281-1448088947db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        likes: 15,
        comments: 3,
      },
    ],
  },
  '2': {
    name: 'Poesia e Romance',
    description: 'Versos que tocam o coração.',
    members: 850,
    likes: 320,
    rating: 4.6,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-6376cc9a240c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    posts: [
      {
        id: 'p3',
        title: 'Amor Eterno',
        content: 'Um poema sobre o amor verdadeiro.',
        likes: 18,
        comments: 5,
      },
    ],
  },
};

const ComunidadeDetails = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [community, setCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [communityLikes, setCommunityLikes] = useState(0);

  useEffect(() => {
    // Simulação de busca (substitua por Firebase)
    const fetchedCommunity = MOCK_COMMUNITIES[1];
    if (fetchedCommunity) {
      setCommunity(fetchedCommunity);
      setCommunityLikes(fetchedCommunity.likes);
    }
  }, [id]);

  const handleJoinCommunity = () => {
    if (community) {
      alert(`Você entrou na comunidade "${community.name}"!`);
    }
  };

  const handleLikeCommunity = () => {
    setCommunityLikes((prev) => prev + 1);
  };

  const handleCreateTopic = () => {
    alert('Funcionalidade de criar tópico em desenvolvimento!');
  };

  if (!community) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <p className={styles.noResults}>Comunidade não encontrada.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Cabeçalho */}
        <header className={styles.header}>
            <div className={ styles.overlap } ></div>
          <img src={community.coverImage} alt="Capa" className={styles.coverImage} />
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{community.name}</h1>
            <p className={styles.description}>{community.description}</p>
            <div className={styles.headerActions}>
              <span className={styles.memberCount}>{community.members} membros</span>
              <button className={styles.joinButton} onClick={handleJoinCommunity}>
                Faça Parte
              </button>
            </div>
          </div>
        </header>

        {/* Layout com Menu e Conteúdo */}
        <div className={styles.layout}>
          {/* Menu Lateral */}
          <aside className={styles.sidebar}>
            <nav className={styles.tabs}>
              <button
                className={activeTab === 'sobre' ? styles.activeTab : ''}
                onClick={() => setActiveTab('sobre')}
              >
                Sobre
              </button>
              <button
                className={activeTab === 'posts' ? styles.activeTab : ''}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
              <button
                className={activeTab === 'membros' ? styles.activeTab : ''}
                onClick={() => setActiveTab('membros')}
              >
                Membros
              </button>
              <button
                className={activeTab === 'chat' ? styles.activeTab : ''}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>
            </nav>

            {/* Conteúdo do Menu */}
            {activeTab === 'membros' && (
              <div className={styles.tabContent}>
                <h3>Membros</h3>
                <p>Lista de membros em desenvolvimento.</p>
              </div>
            )}
            {activeTab === 'chat' && (
              <div className={styles.tabContent}>
                <h3>Chat</h3>
                <p>Chat da comunidade em desenvolvimento.</p>
              </div>
            )}
          </aside>

          {/* Conteúdo Principal */}
          <section className={styles.content}>
            {activeTab === 'posts' && (
              <>
                <div className={styles.actions}>
                  <button className={styles.createTopicButton} onClick={handleCreateTopic}>
                    <FaPlus /> Criar Tópico
                  </button>
                </div>
                <div className={styles.postGrid}>
                  {community.posts.map((post) => (
                    <div key={post.id} className={styles.postCard}>
                      <h3>{post.title}</h3>
                      {post.content && <p>{post.content}</p>}
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} className={styles.postImage} />
                      )}
                      <div className={styles.postActions}>
                        <span>
                          <FaRegHeart /> {post.likes} Likes
                        </span>
                        <span>
                          <FaCommentAlt /> {post.comments} Comentários
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'sobre' && (
              <div className={styles.tabContent}>

                    <h3>Sobre a Comunidade</h3>
                    <p>Descrição da comunidade</p>

                    <div className={ styles.infoComunidade } >
                        <p>Membros: {community.members}</p>
                        <p>
                        Likes: {communityLikes}
                        <button className={styles.likeButton} onClick={handleLikeCommunity}>
                            <FaRegHeart />
                        </button>
                        </p>
                        <p>Nota: <span className={ styles.rating } >{community.rating}/5</span></p>
                        <p>Total de Posts: {community.posts.length}</p>

                    </div>
   
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComunidadeDetails;