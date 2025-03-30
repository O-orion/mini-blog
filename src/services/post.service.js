import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const fetchPosts = async () => {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    return postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw error;
  }
};