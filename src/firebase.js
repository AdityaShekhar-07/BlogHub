import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAq6pP4rtK7QCBPWlD_FPp-6ckkkPrskA0",
  authDomain: "bloghub-8c8be.firebaseapp.com",
  projectId: "bloghub-8c8be",
  storageBucket: "bloghub-8c8be.firebasestorage.app",
  messagingSenderId: "661343799843",
  appId: "1:661343799843:web:a67b42d6fbb4bafab5bf96",
  measurementId: "G-6H43DEQ9P7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();