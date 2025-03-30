import React, { useState, useEffect } from 'react';
import SiderBar from '../../components/siderBar/SiderBar';
import Filters from '../../components/filters/Filters';
import SearchBar from '../../components/search/Search';
import PostCard from '../../components/PostCard/PostCard';
import { fetchPosts } from '../../services/post.service';
import styles from './navegar.module.css';

const Navegar = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [searchTag, setSearchTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
        applyFilters(postsData, filter, searchTag);
      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters(posts, filter, searchTag);
  }, [filter, searchTag, posts]);

  const applyFilters = (postsData, currentFilter, currentTag) => {
    let result = [...postsData];

    if (currentFilter !== 'todos') {
      result = result.filter((post) => post.type === currentFilter);
    }

    if (currentTag) {
      result = result.filter((post) =>
        post.tags?.some((tag) => tag.toLowerCase().includes(currentTag))
      );
    }

    setFilteredPosts(result);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (tag) => {
    setSearchTag(tag);
  };

  return (
    <div className={styles.container}>
      <SiderBar />
      <main className={styles.main}>
        <SearchBar onSearch={handleSearch} />
        <Filters activeFilter={filter} onFilterChange={handleFilterChange} />
        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : filteredPosts.length > 0 ? (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>Nenhum post encontrado.</p>
        )}
      </main>
    </div>
  );
};

export default Navegar;