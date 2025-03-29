import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { useAuthentication } from '../../hooks/useAuthentication';
import { FaUserCircle } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, loading } = useAuthStatus();
  const { logout } = useAuthentication();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.menu}>
      <NavLink to="/" className={styles.brand}>
        My<span>Poems</span>
      </NavLink>
      <ul className={styles.linksList}>
        {!user ? (
          <>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/cadastro" className={({ isActive }) => (isActive ? styles.active : '')}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : '')}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : '')}>
                About
              </NavLink>
            </li>
          </>
        ) : (
          <li className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
            <button
              className={styles.profileIcon}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle size={28} />
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? styles.active : '')}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Perfil
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-posts"
                    className={({ isActive }) => (isActive ? styles.active : '')}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Meus Posts
                  </NavLink>
                </li>
                <li>
                  <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;