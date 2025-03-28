import React from 'react';
import styles from './home.module.css';
import SiderBar from '../../components/siderBar/SiderBar';
import ListPost from '../../components/listPost/ListPost';
import SiderBarRight from '../../components/siderBarRight/SiderBarRight';
import CreatePost from '../../components/createPost/CreatePost';

const Home = () => {
  return (
    <div className={styles.container}>
      <SiderBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Fluxo de Pensamentos</h1>
          <CreatePost />
        </header>
        <ListPost />
      </main>
      <SiderBarRight />
    </div>
  );
};

export default Home;