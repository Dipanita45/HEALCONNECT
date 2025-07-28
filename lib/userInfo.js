import { doc, onSnapshot, getFirestore, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import { useEffect, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-hot-toast';
import {
  showErrorToast,
  showRetryToast,
  checkNetworkStatus,
  ERROR_TYPES
} from './errorHandler';

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Retry function for manual retry
  const retryFetch = useCallback(() => {
    setError(null);
    setIsUserLoading(true);
    setIsRetrying(true);

    setTimeout(() => setIsRetrying(false), 2000);
  }, []);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;
    let userData;

    const getUserRole = async () => {
      if (user) {
        try {
          // Check network connectivity
          if (!checkNetworkStatus()) {
            throw new Error('No internet connection');
          }

          setIsUserLoading(true);
          setError(null);

          // Try to get user from 'users' collection first
          const userRef = doc(db, 'users', user.uid);
          const userRefSpan = await getDoc(userRef);

          if (userRefSpan.exists()) {
            // Set up listeners for users collection
            unsubscribe = onSnapshot(
              userRef,
              (doc) => {
                try {
                  if (doc.exists()) {
                    const userData = doc.data();
                    setUserRole(userData?.role || null);
                    setCurrentUser(userData);
                    setError(null);
                  }
                } catch (processingError) {
                  console.error('Error processing user data:', processingError);
                  setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message });
                  showErrorToast(processingError, 'Error processing user data');
                }
              },
              (firestoreError) => {
                console.error('Firestore error in user listener:', firestoreError);
                handleFirestoreError(firestoreError);
              }
            );

            setIsUserLoading(false);
          } else {
            // Try patients collection if not found in users
            const patientRef = doc(db, 'patients', user.phoneNumber || user.uid);
            const patientRefSpan = await getDoc(patientRef);

            if (patientRefSpan.exists()) {
              unsubscribe = onSnapshot(
                patientRef,
                (doc) => {
                  try {
                    if (doc.exists()) {
                      const patientData = doc.data();
                      setUserRole(patientData?.role || 'patient');
                      setCurrentUser(patientData);
                      setError(null);
                    }
                  } catch (processingError) {
                    console.error('Error processing patient data:', processingError);
                    setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message });
                    showErrorToast(processingError, 'Error processing patient data');
                  }
                },
                (firestoreError) => {
                  console.error('Firestore error in patient listener:', firestoreError);
                  handleFirestoreError(firestoreError);
                }
              );

              setIsUserLoading(false);
            } else {
              // User not found in either collection
              setError({
                type: ERROR_TYPES.DATA_FETCH_ERROR,
                message: 'User profile not found'
              });
              setIsUserLoading(false);
              showErrorToast(null, 'User profile not found. Please contact support.');
            }
          }
        } catch (error) {
          console.error('Error in getUserRole:', error);

          let errorType = ERROR_TYPES.DATA_FETCH_ERROR;
          let userMessage = 'Failed to load user profile';

          if (!checkNetworkStatus()) {
            errorType = ERROR_TYPES.NETWORK_ERROR;
            userMessage = 'Internet connection lost';
          } else if (error.code === 'permission-denied') {
            userMessage = 'Access denied to user profile';
          }

          setError({ type: errorType, message: error.message });
          setIsUserLoading(false);

          // Show retry option for recoverable errors
          if (errorType === ERROR_TYPES.NETWORK_ERROR || errorType === ERROR_TYPES.FIREBASE_ERROR) {
            showRetryToast(retryFetch, userMessage + '. Click to retry.');
          } else {
            showErrorToast(error, userMessage);
          }
        }
      } else {
        // User not logged in
        setUserRole(null);
        setCurrentUser(null);
        setIsUserLoading(false);
        setError(null);
      }
    };

    // Helper function to handle Firestore errors
    const handleFirestoreError = (firestoreError) => {
      let errorType = ERROR_TYPES.FIREBASE_ERROR;
      let userMessage = 'Database connection failed';

      if (!checkNetworkStatus()) {
        errorType = ERROR_TYPES.NETWORK_ERROR;
        userMessage = 'Internet connection lost';
      } else if (firestoreError.code === 'permission-denied') {
        userMessage = 'Access denied to user data';
      }

      setError({ type: errorType, message: firestoreError.message });
      setIsUserLoading(false);

      // Show retry option for certain errors
      if (errorType === ERROR_TYPES.NETWORK_ERROR || errorType === ERROR_TYPES.FIREBASE_ERROR) {
        showRetryToast(retryFetch, userMessage + '. Click to retry.');
      } else {
        showErrorToast(firestoreError, userMessage);
      }
    };

    getUserRole();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      if (userData && typeof userData === 'function') {
        userData();
      }
    };
  }, [user, retryFetch]);

  // Auto-retry on network status change
  useEffect(() => {
    const handleOnline = () => {
      if (error?.type === ERROR_TYPES.NETWORK_ERROR && user) {
        retryFetch();
      }
    };

    const handleOffline = () => {
      if (user) {
        setError({ type: ERROR_TYPES.NETWORK_ERROR, message: 'Internet connection lost' });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, user, retryFetch]);

  return {
    user,
    currentUser,
    userRole,
    isUserLoading,
    error,
    isRetrying,
    retryFetch
  };
}
