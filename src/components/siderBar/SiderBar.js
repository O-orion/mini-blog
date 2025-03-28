import React from 'react'
import styles from './siderbar.module.css';

function SiderBar() {
  return (
          <aside className={styles.menuLateral}>
            <ul className={styles.menu_list}>
              <li className={styles.menu_item}>
                <a href="#" className={styles.menu_link}>Início</a>
              </li>
              <li className={styles.menu_item}>
                <a href="#" className={styles.menu_link}>Navegar</a>
              </li>
              <li className={styles.menu_item}>
                <a href="#" className={styles.menu_link}>Comunidades</a>
              </li>
            </ul>
          </aside>
  )
}

export default SiderBar