import React from 'react';
import styles from './home.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import SiderBar from '../../components/siderBar/SiderBar';
import ListPost from '../../components/listPost/ListPost';
import SiderBarRight from '../../components/siderBarRight/SiderBarRight';

const Home = () => {
  return (
    <div className={styles.grid}>
      {/* Menu Lateral */}
      <SiderBar />

      {/* Feed Central */}
      <section className={styles.feed}>
        <h2>Feed de Poesias</h2>
        <p>Aqui aparecerão os posts mais recentes.</p>
        <ListPost />
      </section>

      {/* Sidebar Direita */}
      <SiderBarRight />
    </div>
  );
};

export default Home;