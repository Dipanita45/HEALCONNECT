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
    // Check localStorage first for immediate UI updates
    const storedUserType = localStorage.getItem('userType')
    const storedUsername = localStorage.getItem('username')
    
    if (storedUserType && isInitialMount.current) {
      setUserRole(storedUserType)
      setCurrentUser({ 
        name: storedUsername,
        role: storedUserType 
      })
      isInitialMount.current = false
      setIsUserLoading(false)
      return
    }

    // Try to initialize Firebase Auth
    try {
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
            console.error('Firebase Firestore error: ', err.message)
            // Fallback to localStorage if Firebase fails
            if (storedUserType && storedUsername) {
              setUserRole(storedUserType)
              setCurrentUser({ 
                name: storedUsername,
                role: storedUserType 
              })
            }
          }
        } else {
          // Only clear if no localStorage data exists
          if (!storedUserType) {
            setUserRole(null)
            setCurrentUser(null)
          }
        }

        setIsUserLoading(false)
      })

      return () => unsubscribeAuth()
    } catch (err) {
      console.error('Firebase Auth initialization error: ', err.message)
      // Fallback to localStorage if Firebase fails
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
