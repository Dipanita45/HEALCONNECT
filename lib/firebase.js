// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
fix/button-style-consistency
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  function createFirebaseApp(config){
    try{
        return getApp();
    }
    catch{
        return initializeApp(config);
    }
  }

  const firebaseApp = createFirebaseApp(firebaseConfig);

  //   Auth exports
  //export const auth = getAuth(firebaseApp);

  //   Firestore exports
  export const db = getFirestore(firebaseApp);

  //   Storage exports
  export const storage = getStorage(firebaseApp);
  export const STATE_CHANGED = 'state_changed';

};
 main

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize services
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
