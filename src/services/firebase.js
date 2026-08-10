import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Safe initialization — do NOT crash the entire app if Firebase config is missing.
// Phone OTP will show a clear error; the rest of the website keeps working.
let app = null;
let auth = null;
let firebaseConfigError = null;

try {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key is not configured. Set VITE_FIREBASE_API_KEY in Vercel environment variables.');
  }
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  firebaseConfigError = err.message || 'Firebase initialization failed.';
  console.error('[firebase.js] Firebase initialization failed:', firebaseConfigError);
}

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber, firebaseConfigError };
