import React, { useState } from 'react';
import SideBar from '../../components/siderBar/SiderBar';
import styles from './comunidade.module.css';
import { useNavigate } from 'react-router-dom';

const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: 'Amantes da Natureza',
    members: 1200,
    description: 'Explore a beleza do mundo natural.',
    coverImage: 'https://123ecos.com.br/wp-content/uploads/2024/09/floresta-tropical.jpg',
  },
  {
    id: 2,
    name: 'Poesia e Romance',
    members: 850,
    description: 'Versos que tocam o coração.',
    coverImage: 'https://cdn.ome.lt/51AIPBTCyASybXn1rcFKJAs37vE=/1200x630/smart/extras/conteudos/entre-montanhas-critica.jpg',
  },
  {
    id: 3,
    name: 'Dark Vibes',
    members: 670,
    description: 'Estética sombria e reflexiva.',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8459945d1c8e4430b6ad5f2207',
  },
  {
    id: 4,
    name: 'Fotografia Criativa',
    members: 2000,
    description: 'Capture o mundo com sua lente.',
    coverImage: 'https://blog.emania.com.br/wp-content/uploads/2021/07/O-que-e-a-Fotografia-Hoje-em-dia-Blog-eMania-5-1024x576.jpg',
  },
  {
    id: 5,
    name: 'Música Alternativa',
    members: 950,
    description: 'Sons que fogem do mainstream.',
    coverImage: 'https://musicosmos.com.br/wp-content/uploads/2019/10/rockin-strings.jpg',
  },
];

const Comunidades = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = MOCK_COMMUNITIES.filter((community) =>
      community.name.toLowerCase().includes(term)
    );
    setCommunities(filtered);
  };

  const handleCreateCommunity = () => {
    alert('Funcionalidade de criar comunidade em desenvolvimento!');
  };

  const handleJoinCommunity = (communityName) => {
 
    navigate('/comunidadeDetalhes')
    
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <section className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>Comunidades</h2>
          <button className={styles.createButton} onClick={handleCreateCommunity}>
            Criar Comunidade
          </button>
        </header>

        <input
          type="text"
          placeholder="Pesquise sua comunidade..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className={styles.communityList}>
          {communities.length > 0 ? (
            communities.map((community) => (
              <div onClick={ handleJoinCommunity } key={community.id} className={styles.communityCard}>
                <img
                  src={community.coverImage}
                  alt={`${community.name} capa`}
                  className={styles.coverImage}
                />
                <div className={styles.cardContent}>
                  <h3 className={styles.communityName}>{community.name}</h3>
                  <p className={styles.communityDescription}>{community.description}</p>
                  <span className={styles.memberCount}>{community.members} membros</span>
                  <button
                    className={styles.joinButton}
                    onClick={() => handleJoinCommunity(community.name)}
                  >
                    Faça Parte
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Nenhuma comunidade encontrada.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Comunidades;