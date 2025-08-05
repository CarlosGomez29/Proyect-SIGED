"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    projectId: "esac-manager",
    appId: "1:1014997648612:web:0dc62d590a1cd3a9c598f1",
    storageBucket: "esac-manager.firebasestorage.app",
    apiKey: "AIzaSyBVnGTpbY85rmPSXD6bpQ1qXCAraQMRbUw",
    authDomain: "esac-manager.firebaseapp.com",
    measurementId: "",
    messagingSenderId: "1014997648612"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
