// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app;
let auth;
let db;
let storage;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const isConfigValid =
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

  if (!isConfigValid) {
    console.error(
      "⚠️ Firebase config missing. Check .env.local and restart dev server."
    );
  } else {
    app = !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp();

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
}

export { auth, db, storage };
