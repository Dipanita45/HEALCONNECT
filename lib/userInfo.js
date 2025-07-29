import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { useEffect, useState } from 'react';

export function useUserData() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  // Dummy user for now (auth is commented out)
  const user = null;

  useEffect(() => {
    let unsubscribe = () => {};
    let userData = () => {};

    const getUserRole = async () => {
      setIsUserLoading(true);

      if (user) {
        try {
          const ref = doc(db, 'users', user.uid);
          const refSnap = await getDoc(ref);
          if (refSnap.exists()) {
            unsubscribe = onSnapshot(ref, (doc) => {
              setUserRole(doc.data()?.role);
            });
            userData = onSnapshot(ref, (doc) => {
              setCurrentUser(doc.data());
            });
          } else {
            const altRef = doc(db, 'patients', user.phoneNumber);
            unsubscribe = onSnapshot(altRef, (doc) => {
              setUserRole(doc.data()?.role);
            });
            userData = onSnapshot(altRef, (doc) => {
              setCurrentUser(doc.data());
            });
          }
        } catch (error) {
          console.error("Firebase error: ", error.message);
        }
      } else {
        setUserRole(null);
      }

      setIsUserLoading(false);
    };

    getUserRole();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return { user, currentUser, userRole, isUserLoading };
}
