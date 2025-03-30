import React from 'react';
import styles from './siderbar.module.css';
import { FaHome, FaCompass, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SiderBar() {

  const navigate = useNavigate();

  const handleNavigateExplorar = (e) => {
    e.preventDefault();
    navigate('/navegar');
  }

  const handleNavigateHome = (e) => {
    e.preventDefault();
    navigate('/');
  }

  const handleNavigateComunidades = (e) => {
    e.preventDefault();
    navigate('/comunidades');
  }

  return (
    <aside className={styles.menuLateral}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <a onClick={handleNavigateHome }  className={styles.menuLink}>
            <FaHome className={styles.icon} />
            <span>Início</span>
          </a>
        </li>
        <li className={styles.menuItem}>
          <a onClick={ handleNavigateExplorar } className={styles.menuLink}>
            <FaCompass className={styles.icon} />
            <span>Navegar</span>
          </a>
        </li>
        <li className={styles.menuItem}>
          <a onClick={ handleNavigateComunidades } className={styles.menuLink}>
            <FaUsers className={styles.icon} />
            <span>Comunidades</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default SiderBar;