// lib/userInfo.js
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useUserData() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // TODO: Fetch user role from your DB or custom claims here
        // For example, fetch role from Firestore 'users' collection by uid:
        /*
        const doc = await firestore.collection('users').doc(firebaseUser.uid).get();
        setUserRole(doc.data()?.role);
        */
        setUserRole('patient'); // temp hardcoded, replace with real logic
      } else {
        setUserRole(null);
      }
    });
    return unsubscribe;
  }, []);

  return { user, userRole, setUser, setUserRole };
}
