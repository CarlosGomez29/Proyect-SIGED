
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "esac-manager",
  appId: "1:1014997648612:web:0dc62d590a1cd3a9c598f1",
  storageBucket: "esac-manager.firebasestorage.app",
  apiKey: "AIzaSyBVnGTpbY85rmPSXD6bpQ1qXCAraQMRbUw",
  authDomain: "esac-manager.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "1014997648612"
};

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}
