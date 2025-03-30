import React from 'react';
import styles from './filter.module.css';

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'texto', label: 'Texto' },
  { key: 'foto', label: 'Fotos' },
  { key: 'video', label: 'Vídeos' },
];

const Filters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className={styles.filters}>
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          className={filter.key === activeFilter ? styles.activeFilter : ''}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default Filters;