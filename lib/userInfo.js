// lib/userInfo.js
import { useState, useEffect } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export function useUserData() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setCurrentUser(null)
          setUserRole(null)
          setIsUserLoading(false)
          return
        }

        setCurrentUser(firebaseUser)

        // 🔹 Check users collection
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setUserRole(userSnap.data()?.role || null)
          setIsUserLoading(false)
          return
        }

        // 🔹 Fallback: patients collection (phone auth)
        if (firebaseUser.phoneNumber) {
          const patientRef = doc(db, 'patients', firebaseUser.phoneNumber)
          const patientSnap = await getDoc(patientRef)

          if (patientSnap.exists()) {
            setUserRole(patientSnap.data()?.role || null)
            setIsUserLoading(false)
            return
          }
        }

        // 🔹 No role found
        setUserRole(null)
        setIsUserLoading(false)
      } catch (err) {
        console.error('Firebase error:', err.message)
        setUserRole(null)
        setIsUserLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { currentUser, userRole, isUserLoading }
}