import { initializeApp, getApps, getApp } from "firebase/app"; // Adicionado getApps e getApp para evitar reinicialização
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- PASSO 1: Importe getStorage

const firebaseConfig = {
  apiKey: "AIzaSyAxD8L28q9ufkbWtdMA24b5evtPEwb-Gak",
  authDomain: "nutrana-4660f.firebaseapp.com",
  projectId: "nutrana-4660f",
  storageBucket: "nutrana-4660f.firebasestorage.app",
  messagingSenderId: "42918318281",
  appId: "1:42918318281:web:66ab9d20d33b5bdddcbd18",
  measurementId: "G-7ZDLE2LB23"
};

// Use getApps() para verificar se o app já foi inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- PASSO 2: Inicialize o Storage

export const googleProvider = new GoogleAuthProvider();

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'consent',
  tenant: process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || '',
});

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');