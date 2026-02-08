// lib/userInfo.js
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useUserData() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);

      try {
        // 🔴 Logged out
        if (!firebaseUser) {
          setUser(null);
          setCurrentUser(null);
          setUserRole(null);
          return;
        }

        setUser(firebaseUser);

        // 🔹 Check users collection
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setCurrentUser(data);
          setUserRole(data?.role || null);
          return;
        }

        // 🔹 Fallback: patients collection (phone auth)
        if (firebaseUser.phoneNumber) {
          const patientRef = doc(db, "patients", firebaseUser.phoneNumber);
          const patientSnap = await getDoc(patientRef);

          if (patientSnap.exists()) {
            const data = patientSnap.data();
            setCurrentUser(data);
            setUserRole(data?.role || null);
            return;
          }
        }

        // 🔹 Auth exists but no Firestore record
        setCurrentUser(null);
        setUserRole(null);
      } catch (error) {
        console.error("Auth/Firestore error:", error);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setIsUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    currentUser,
    userRole,
    isUserLoading,
  };
}