import React from 'react'
import styles from './search.module.css';

function Search({onSearch }) {

    const handleSearch = (e) => {
        if ( e.key === 'Enter') {
            onSearch(e.target.value.trim().toLowerCase());
        }
    }

  return (
    <input 
    type='text'
    placeholder='Pesquise por tags (eX: Natureza, Jogos, Animes,...)'
    className={ styles.searchInput }
    onKeyDown={ handleSearch }
    />
  )
}

export default Search