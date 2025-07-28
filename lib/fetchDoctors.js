import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import {
  showErrorToast,
  showRetryToast,
  createRetryFunction,
  checkNetworkStatus,
  ERROR_TYPES
} from './errorHandler'

export default function FetchDoctors() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [doctors, setDoctors] = useState([])
    const [isRetrying, setIsRetrying] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    // Retry function for manual retry
    const retryFetch = useCallback(() => {
        setError(null)
        setLoading(true)
        setIsRetrying(true)

        setTimeout(() => setIsRetrying(false), 2000)
    }, [])

    // Enhanced data fetching with error handling
    useEffect(() => {
        let unsubscribe = null

        const setupListener = async () => {
            try {
                // Check network connectivity
                if (!checkNetworkStatus()) {
                    throw new Error('No internet connection')
                }

                setLoading(true)
                const collectionRef = collection(db, 'users')

                unsubscribe = onSnapshot(
                    collectionRef,
                    (snapshot) => {
                        try {
                            let docts = []
                            snapshot.docs.forEach((doc) => {
                                const userData = doc.data()
                                // Only include users with doctor role
                                if (userData.role === 'doctor') {
                                    docts.push({
                                        ...userData,
                                        id: doc.id,
                                        lastFetched: new Date().toISOString()
                                    })
                                }
                            })

                            setDoctors(docts)
                            setLastUpdated(new Date())
                            setError(null)
                            setLoading(false)
                        } catch (processingError) {
                            console.error('Error processing doctors data:', processingError)
                            setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message })
                            showErrorToast(processingError, 'Error processing doctors data')
                            setLoading(false)
                        }
                    },
                    (firestoreError) => {
                        console.error('Firestore error in fetchDoctors:', firestoreError)

                        let errorType = ERROR_TYPES.FIREBASE_ERROR
                        let userMessage = 'Failed to load doctors data'

                        if (!checkNetworkStatus()) {
                            errorType = ERROR_TYPES.NETWORK_ERROR
                            userMessage = 'Internet connection lost'
                        } else if (firestoreError.code === 'permission-denied') {
                            userMessage = 'Access denied to doctors data'
                        }

                        setError({ type: errorType, message: firestoreError.message })
                        setLoading(false)

                        // Show retry option for recoverable errors
                        if (errorType === ERROR_TYPES.NETWORK_ERROR || errorType === ERROR_TYPES.FIREBASE_ERROR) {
                            showRetryToast(retryFetch, userMessage + '. Click to retry.')
                        } else {
                            showErrorToast(firestoreError, userMessage)
                        }
                    }
                )

            } catch (setupError) {
                console.error('Failed to setup doctors listener:', setupError)

                let errorType = ERROR_TYPES.DATA_FETCH_ERROR
                let userMessage = 'Failed to connect to doctors database'

                if (!checkNetworkStatus()) {
                    errorType = ERROR_TYPES.NETWORK_ERROR
                    userMessage = 'No internet connection'
                }

                setError({ type: errorType, message: setupError.message })
                setLoading(false)
                showRetryToast(retryFetch, userMessage + '. Click to retry.')
            }
        }

        setupListener()

        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe()
            }
        }
    }, [retryFetch])

    // Auto-retry on network status change
    useEffect(() => {
        const handleOnline = () => {
            if (error?.type === ERROR_TYPES.NETWORK_ERROR) {
                retryFetch()
            }
        }

        const handleOffline = () => {
            setError({ type: ERROR_TYPES.NETWORK_ERROR, message: 'Internet connection lost' })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [error, retryFetch])

    return {
        loading,
        error,
        doctors,
        isRetrying,
        retryFetch,
        lastUpdated
    }
}
