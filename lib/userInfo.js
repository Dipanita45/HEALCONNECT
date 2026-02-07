// lib/userInfo.js
import { useState, useEffect } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'

export function useUserData() {
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

 useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        setCurrentUser(null);
        setUserRole(null);
        return;
      }

      setCurrentUser(firebaseUser);

      // 🔹 Check users collection
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserRole(data?.role || null);
        return;
      }

      // 🔹 Fallback: patients collection (phone auth)
      if (firebaseUser.phoneNumber) {
        const patientRef = doc(db, "patients", firebaseUser.phoneNumber);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          const data = patientSnap.data();
          setUserRole(data?.role || null);
          return;
        }
      }

      // 🔹 No role found
      setUserRole(null);
    } catch (err) {
      console.error("Firebase error:", err.message);
      setUserRole(null);
    }
  });

  return () => unsubscribeAuth();
}, []);
}