import React from 'react';
import styles from './siderbar.module.css';
import { FaHome, FaCompass, FaUsers } from 'react-icons/fa'; // Ícones do react-icons

function SiderBar() {
  return (
    <aside className={styles.menuLateral}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <a href="#" className={styles.menuLink}>
            <FaHome className={styles.icon} />
            <span>Início</span>
          </a>
        </li>
        <li className={styles.menuItem}>
          <a href="#" className={styles.menuLink}>
            <FaCompass className={styles.icon} />
            <span>Navegar</span>
          </a>
        </li>
        <li className={styles.menuItem}>
          <a href="#" className={styles.menuLink}>
            <FaUsers className={styles.icon} />
            <span>Comunidades</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default SiderBar;