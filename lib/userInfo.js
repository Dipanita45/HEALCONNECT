// lib/userInfo.js
import { useState, useEffect, useRef } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'

export function useUserData() {
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // SECURITY: Firebase Auth + Firestore is the SOURCE OF TRUTH for user roles.
    // localStorage is ONLY used as a UI cache when Firebase is unavailable (demo mode).
    // Never trust localStorage for authorization decisions in production.

    const storedUserType = localStorage.getItem('userType')
    const storedUsername = localStorage.getItem('username')

    // Try to initialize Firebase Auth (SECURITY: Priority #1)
    try {
      // Listen for Firebase Auth state changes
      const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser)

        if (firebaseUser) {
          // User is authenticated via Firebase
          try {
            const ref = doc(db, 'users', firebaseUser.uid)
            const refSnap = await getDoc(ref)

            if (refSnap.exists()) {
              // SECURITY: Trust Firestore as source of truth for role
              const firestoreData = refSnap.data()
              setUserRole(firestoreData?.role)
              setCurrentUser(firestoreData)

              // Cache in localStorage AFTER verification (UI optimization only)
              if (typeof window !== 'undefined') {
                localStorage.setItem('userType', firestoreData?.role || '')
                localStorage.setItem('username', firestoreData?.name || '')
              }

              // listen to user doc for real-time updates
              onSnapshot(ref, (docSnap) => {
                const data = docSnap.data()
                setUserRole(data?.role)
                setCurrentUser(data)
                // Update cache
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userType', data?.role || '')
                }
              })
            } else {
              // fallback: try patients collection
              const altRef = doc(db, 'patients', firebaseUser.phoneNumber)
              const altSnap = await getDoc(altRef)

              if (altSnap.exists()) {
                const firestoreData = altSnap.data()
                setUserRole(firestoreData?.role)
                setCurrentUser(firestoreData)

                // Cache after verification
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userType', firestoreData?.role || '')
                  localStorage.setItem('username', firestoreData?.name || '')
                }
              }

              onSnapshot(altRef, (docSnap) => {
                const data = docSnap.data()
                setUserRole(data?.role)
                setCurrentUser(data)
              })
            }
          } catch (err) {
            console.error('Firebase Firestore error: ', err.message)
            console.warn('⚠️ SECURITY WARNING: Using localStorage fallback. Configure Firebase for production.')

            // FALLBACK ONLY: When Firestore fails (demo mode)
            if (storedUserType && storedUsername) {
              setUserRole(storedUserType)
              setCurrentUser({
                name: storedUsername,
                role: storedUserType
              })
            }
          }
        } else {
          // No Firebase user - clear everything
          setUserRole(null)
          setCurrentUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userType')
            localStorage.removeItem('username')
          }
        }

        setIsUserLoading(false)
      })

      return () => unsubscribeAuth()
    } catch (err) {
      console.error('Firebase Auth initialization error: ', err.message)
      console.warn('⚠️ SECURITY WARNING: Firebase unavailable. Using localStorage fallback (INSECURE).')

      // FALLBACK ONLY: When Firebase completely fails (demo mode)
      if (storedUserType && storedUsername) {
        setUserRole(storedUserType)
        setCurrentUser({
          name: storedUsername,
          role: storedUserType
        })
      }
      setIsUserLoading(false)
    }
  }, [])

  return { user, setUser, currentUser, setCurrentUser, userRole, setUserRole, isUserLoading }
}

