import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import {
  showErrorToast,
  showRetryToast,
  createRetryFunction,
  checkNetworkStatus,
  ERROR_TYPES
} from './errorHandler';

export default function FetchLiveData(deviceId = "0001") {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liveData, setData] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    // Retry function for manual retry
    const retryFetch = useCallback(() => {
        setError(null);
        setLoading(true);
        setIsRetrying(true);
        setConnectionStatus('connecting');

        // Clear retry state after a delay
        setTimeout(() => setIsRetrying(false), 2000);
    }, []);

    // Enhanced data fetching with error handling
    const fetchLiveDataWithRetry = createRetryFunction(async () => {
        return new Promise((resolve, reject) => {
            const documentRef = doc(db, "devices", deviceId);

            // Set up real-time listener with error handling
            const unsubscribe = onSnapshot(
                documentRef,
                { includeMetadataChanges: true },
                (docSnapshot) => {
                    try {
                        if (docSnapshot.exists()) {
                            const data = docSnapshot.data();

                            // Enhanced data extraction with fallbacks
                            const processedData = {
                                pulse: data.pulse ?? data.Pulse ?? null,
                                temperature: data.temp ?? data.temperature ?? data.Temprature ?? null,
                                oxygen: data.oxygen ?? null,
                                beatsPerMinute: data.beatsPerMinute ?? null,
                                beatAvg: data.beatAvg ?? null,
                                finger: data.finger ?? false,
                                status: data.status ?? false,
                                timestamp: data.timestamp || new Date().toISOString()
                            };

                            setData(processedData);
                            setLastUpdated(new Date());
                            setConnectionStatus(processedData.status ? 'connected' : 'sensor_offline');
                            setError(null);
                            setLoading(false);

                            resolve(unsubscribe);
                        } else {
                            const errorMsg = `Device ${deviceId} not found in database`;
                            setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: errorMsg });
                            setConnectionStatus('device_not_found');
                            showErrorToast(null, errorMsg);
                            reject(new Error(errorMsg));
                        }
                    } catch (processingError) {
                        console.error('Error processing document data:', processingError);
                        setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message });
                        setConnectionStatus('error');
                        showErrorToast(processingError, 'Error processing sensor data');
                        reject(processingError);
                    }
                },
                (firestoreError) => {
                    console.error('Firestore listener error:', firestoreError);

                    let errorType = ERROR_TYPES.FIREBASE_ERROR;
                    let userMessage = 'Database connection failed';

                    // Check for specific error types
                    if (!checkNetworkStatus()) {
                        errorType = ERROR_TYPES.NETWORK_ERROR;
                        userMessage = 'No internet connection';
                        setConnectionStatus('network_offline');
                    } else if (firestoreError.code === 'permission-denied') {
                        userMessage = 'Access denied to sensor data';
                        setConnectionStatus('permission_denied');
                    } else {
                        setConnectionStatus('firebase_error');
                    }

                    setError({ type: errorType, message: firestoreError.message });
                    setLoading(false);

                    // Show retry option for certain errors
                    if (errorType === ERROR_TYPES.NETWORK_ERROR || errorType === ERROR_TYPES.FIREBASE_ERROR) {
                        showRetryToast(retryFetch, userMessage + '. Click to retry.');
                    } else {
                        showErrorToast(firestoreError, userMessage);
                    }

                    reject(firestoreError);
                }
            );

            // Return unsubscribe function
            return unsubscribe;
        });
    }, 3, 2000); // 3 retries with 2 second base delay

    useEffect(() => {
        let unsubscribe = null;

        // Check network status before attempting to fetch
        if (!checkNetworkStatus()) {
            setError({ type: ERROR_TYPES.NETWORK_ERROR, message: 'No internet connection' });
            setConnectionStatus('network_offline');
            setLoading(false);
            showRetryToast(retryFetch, 'No internet connection. Click to retry when online.');
            return;
        }

        const setupListener = async () => {
            try {
                unsubscribe = await fetchLiveDataWithRetry();
            } catch (error) {
                console.error('Failed to set up data listener after retries:', error);
                setLoading(false);
            }
        };

        setupListener();

        // Cleanup function
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [deviceId, retryFetch]);

    // Auto-retry on network status change
    useEffect(() => {
        const handleOnline = () => {
            if (error?.type === ERROR_TYPES.NETWORK_ERROR) {
                retryFetch();
            }
        };

        const handleOffline = () => {
            setError({ type: ERROR_TYPES.NETWORK_ERROR, message: 'Internet connection lost' });
            setConnectionStatus('network_offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [error, retryFetch]);

    return {
        liveData,
        loading,
        error,
        isRetrying,
        retryFetch,
        lastUpdated,
        connectionStatus
    };
}

