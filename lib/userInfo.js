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
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);

      try {
        if (!firebaseUser) {
          setUser(null);
          setCurrentUser(null);
          setUserRole(null);
          setIsUserLoading(false);
          return;
        }

        setUser(firebaseUser);

        // 🔹 Check users collection (email / normal auth)
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setCurrentUser(data);
          setUserRole(data?.role || null);
          setIsUserLoading(false);
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
            setIsUserLoading(false);
            return;
          }
        }

        // 🔹 No matching user found
        setCurrentUser(null);
        setUserRole(null);
      } catch (error) {
        console.error("Firebase auth error:", error.message);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setIsUserLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return {
    user,
    currentUser,
    userRole,
    isUserLoading,
  };
}