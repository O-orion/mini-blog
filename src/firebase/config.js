import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Banco de dados
import { getAuth } from "firebase/auth"; // Autenticação

const firebaseConfig = {
  apiKey: "AIzaSyBR1EIodTCWOThoQEfpkcfmF7SSjfMWd2k",
  authDomain: "blindmatch-f1743.firebaseapp.com",
  projectId: "blindmatch-f1743",
  storageBucket: "blindmatch-f1743.firebasestorage.app",
  messagingSenderId: "474561507830",
  appId: "1:474561507830:web:263e5795a3589ce5c757d7",
  measurementId: "G-KPF1M3N5LG",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Configurando banco de dados
export const db = getFirestore(app);

// Configurando autenticação
export const auth = getAuth(app);