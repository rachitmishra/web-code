import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const getEnv = (key: string) => {
  return (import.meta.env?.[key]) || (typeof process !== 'undefined' ? process.env[key] : undefined);
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Validate config to avoid cryptic Firebase errors
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.warn('[Firebase] VITE_FIREBASE_API_KEY is missing or invalid. Auth features will fail.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
