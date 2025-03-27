import React from 'react'
import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css'

function Navbar() {
  return (
    <nav className={ styles.menu } >
        <NavLink to="/" className={styles.brand} >
            Mini<span>-blog</span>
        </NavLink>
        <ul className={ styles.links_list } >
            <li>
                <NavLink to="/"  className={({isActive}) => ( isActive ? styles.active : "" ) } >Home</NavLink>
            </li>
            <li>
                <NavLink to="/about"  className={({isActive}) => ( isActive ? styles.active : "" ) } >About</NavLink>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar