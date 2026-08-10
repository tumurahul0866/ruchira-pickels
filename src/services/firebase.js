import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyPlaceholderForDevOnly',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vasuki-pickles.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vasuki-pickles',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vasuki-pickles.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:demo',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };
