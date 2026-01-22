import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAP_AALZF5mZH0yJ_Md7oQaXZX7bVaXuQ4",
    authDomain: "planora-7e184.firebaseapp.com",
    projectId: "planora-7e184",
    storageBucket: "planora-7e184.firebasestorage.app",
    messagingSenderId: "577934609929",
    appId: "1:577934609929:web:40eff7c5ba13574c2172d8"
  };

// Prevent re-initializing Firebase on hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
