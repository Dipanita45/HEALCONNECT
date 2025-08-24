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
    // Listen for Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid)
          const refSnap = await getDoc(ref)

          if (refSnap.exists()) {
            // listen to user doc in users collection
            onSnapshot(ref, (docSnap) => {
              setUserRole(docSnap.data()?.role)
              setCurrentUser(docSnap.data())
            })
          } else {
            // fallback: try patients collection
            const altRef = doc(db, 'patients', firebaseUser.phoneNumber)
            onSnapshot(altRef, (docSnap) => {
              setUserRole(docSnap.data()?.role)
              setCurrentUser(docSnap.data())
            })
          }
        } catch (err) {
          console.error('Firebase error: ', err.message)
        }
      } else {
        setUserRole(null)
        setCurrentUser(null)
      }

      setIsUserLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  return { user, currentUser, userRole, isUserLoading }
}
