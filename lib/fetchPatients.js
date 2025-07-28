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

function FetchPatients() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [patients, setPatients] = useState([])
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
                const collectionRef = collection(db, 'patients')

                unsubscribe = onSnapshot(
                    collectionRef,
                    (snapshot) => {
                        try {
                            let patientsList = []
                            snapshot.docs.forEach((doc) => {
                                const patientData = doc.data()
                                patientsList.push({
                                    ...patientData,
                                    id: doc.id,
                                    lastFetched: new Date().toISOString()
                                })
                            })

                            setPatients(patientsList)
                            setLastUpdated(new Date())
                            setError(null)
                            setLoading(false)
                        } catch (processingError) {
                            console.error('Error processing patients data:', processingError)
                            setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message })
                            showErrorToast(processingError, 'Error processing patients data')
                            setLoading(false)
                        }
                    },
                    (firestoreError) => {
                        console.error('Firestore error in fetchPatients:', firestoreError)

                        let errorType = ERROR_TYPES.FIREBASE_ERROR
                        let userMessage = 'Failed to load patients data'

                        if (!checkNetworkStatus()) {
                            errorType = ERROR_TYPES.NETWORK_ERROR
                            userMessage = 'Internet connection lost'
                        } else if (firestoreError.code === 'permission-denied') {
                            userMessage = 'Access denied to patients data'
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
                console.error('Failed to setup patients listener:', setupError)

                let errorType = ERROR_TYPES.DATA_FETCH_ERROR
                let userMessage = 'Failed to connect to patients database'

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
        patients,
        isRetrying,
        retryFetch,
        lastUpdated
    }
}

export default FetchPatients
