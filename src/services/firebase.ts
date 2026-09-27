import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBfMAIYoSq3DF1SYDrQa4gi5f0WLYBcl8M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "josjismart-e17e9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "josjismart-e17e9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "josjismart-e17e9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "660407509483",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:660407509483:web:29f0c0b2df54fd7c0d79ae",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y627R5FB3R",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
