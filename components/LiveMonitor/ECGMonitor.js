import { useState, useEffect, useCallback } from "react";
import { getDoc, onSnapshot, doc } from "firebase/firestore";
import { db } from '@lib/firebase';
import {
  showErrorToast,
  showRetryToast,
  createRetryFunction,
  checkNetworkStatus,
  ERROR_TYPES
} from '@lib/errorHandler';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ECGMonitor() {
  const [data, setData] = useState({});
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [ecgData, setECGData] = useState([{ x: Date.now(), y: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Retry function for manual retry
  const retryConnection = useCallback(() => {
    setError(null);
    setLoading(true);
    setIsRetrying(true);
    setConnectionStatus('connecting');

    setTimeout(() => setIsRetrying(false), 2000);
  }, []);

  // Enhanced data fetching with comprehensive error handling
  useEffect(() => {
    const docRef = doc(db, "devices", "0001");
    let unsubscribe = null;

    const setupDataListener = async () => {
      try {
        // Check network connectivity
        if (!checkNetworkStatus()) {
          throw new Error('No internet connection');
        }

        setLoading(true);
        setConnectionStatus('connecting');

        // Get initial data with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const docPromise = getDoc(docRef);

        try {
          const doc = await Promise.race([docPromise, timeoutPromise]);

          if (doc.exists()) {
            const docData = doc.data();
            setData(docData);
            setDeviceStatus(docData.status || false);
            setConnectionStatus(docData.status ? 'connected' : 'sensor_offline');
            setLastUpdated(new Date());
          } else {
            throw new Error("Device not found in database");
          }
        } catch (initialError) {
          console.warn("Initial data fetch failed, continuing with real-time listener:", initialError);
          // Continue with real-time listener even if initial fetch fails
        }

        // Set up real-time listener with enhanced error handling
        unsubscribe = onSnapshot(
          docRef,
          (doc) => {
            try {
              if (doc.exists()) {
                const docData = doc.data();

                // Validate and sanitize data
                const sanitizedData = {
                  pulse: docData.pulse ?? null,
                  beatsPerMinute: docData.beatsPerMinute ?? null,
                  beatAvg: docData.beatAvg ?? null,
                  oxygen: docData.oxygen ?? null,
                  temp: docData.temp ?? null,
                  finger: docData.finger ?? false,
                  status: docData.status ?? false,
                  timestamp: docData.timestamp || new Date().toISOString()
                };

                setData(sanitizedData);
                setDeviceStatus(sanitizedData.status);
                setConnectionStatus(sanitizedData.status ? 'connected' : 'sensor_offline');
                setError(null);
                setLoading(false);
                setLastUpdated(new Date());

                // Show success toast when reconnecting after error
                if (error && sanitizedData.status) {
                  toast.success('Sensor reconnected successfully!', {
                    duration: 3000,
                    icon: '✅',
                  });
                }
              } else {
                throw new Error("Device document not found");
              }
            } catch (processingError) {
              console.error("Error processing document data:", processingError);
              setError({ type: ERROR_TYPES.DATA_FETCH_ERROR, message: processingError.message });
              setConnectionStatus('error');
              showErrorToast(processingError, 'Error processing sensor data');
            }
          },
          (firestoreError) => {
            console.error("Firestore listener error:", firestoreError);

            let errorType = ERROR_TYPES.FIREBASE_ERROR;
            let userMessage = 'Database connection failed';

            if (!checkNetworkStatus()) {
              errorType = ERROR_TYPES.NETWORK_ERROR;
              userMessage = 'Internet connection lost';
              setConnectionStatus('network_offline');
            } else if (firestoreError.code === 'permission-denied') {
              userMessage = 'Access denied to sensor data';
              setConnectionStatus('permission_denied');
            } else {
              setConnectionStatus('firebase_error');
            }

            setError({ type: errorType, message: firestoreError.message });
            setLoading(false);
            setDeviceStatus(false);

            // Show appropriate error message with retry option
            if (errorType === ERROR_TYPES.NETWORK_ERROR || errorType === ERROR_TYPES.FIREBASE_ERROR) {
              showRetryToast(retryConnection, userMessage + '. Click to retry.');
            } else {
              showErrorToast(firestoreError, userMessage);
            }
          }
        );

      } catch (setupError) {
        console.error("Failed to setup data listener:", setupError);

        let errorType = ERROR_TYPES.DATA_FETCH_ERROR;
        let userMessage = 'Failed to connect to sensor';

        if (setupError.message.includes('timeout')) {
          errorType = ERROR_TYPES.TIMEOUT_ERROR;
          userMessage = 'Connection timeout - check sensor connection';
        } else if (!checkNetworkStatus()) {
          errorType = ERROR_TYPES.NETWORK_ERROR;
          userMessage = 'No internet connection';
          setConnectionStatus('network_offline');
        }

        setError({ type: errorType, message: setupError.message });
        setLoading(false);
        setConnectionStatus('error');

        showRetryToast(retryConnection, userMessage + '. Click to retry.');
      }
    };

    setupDataListener();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [error, retryConnection]);

  // Auto-retry on network status change
  useEffect(() => {
    const handleOnline = () => {
      if (error?.type === ERROR_TYPES.NETWORK_ERROR) {
        retryConnection();
      }
    };

    const handleOffline = () => {
      setError({ type: ERROR_TYPES.NETWORK_ERROR, message: 'Internet connection lost' });
      setConnectionStatus('network_offline');
      setDeviceStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, retryConnection]);

  const [options, setOptions] = useState({
    chart: {
      id: 'realtime',
      height: 450,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },

    xaxis: {
      type: 'datetime',
      range: 60 * 60,
      labels: {
        show: true,
      },
      categories: [''],
    },
    yaxis: {
      max: 1000,
      min: -1600,
      tickAmount: 25,
    },
    legend: {
      show: false
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 0,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newECGData = ecgData ? [...ecgData] : [];
      const pulse = data.pulse;

      if (pulse >= -300 && pulse <= 300) {
        // Pulse input is within range, set y value to a fixed value
        newECGData.push({
          x: Date.now(),
          y: 0,
        });
      } else if (pulse > 600) {
        // Pulse input is greater than 600, create an array of ECG data points
        const pulseArray = [
          {x: Date.now(), y: 64 },
          {x: Date.now() + 5, y: 168},
          {x: Date.now() + 10, y: 272 },
          {x: Date.now() + 15, y: 300 },
          {x: Date.now() + 20, y: 400 },
          {x: Date.now() + 25, y: 500 },
          {x: Date.now() + 30, y: 600 },
          {x: Date.now() + 35, y: 700 },
          {x: Date.now() + 40, y: 896 },
          {x: Date.now() + 45, y: 792 },
          {x: Date.now() + 50, y: 688 },
          {x: Date.now() + 55, y: 584 },
          {x: Date.now() + 60, y: 480 },
          {x: Date.now() + 65, y: 376 },
          {x: Date.now() + 70, y: 272 },
          {x: Date.now() + 75, y: 168 },
          {x: Date.now() + 80, y: 64 },
          {x: Date.now() + 85, y: -40 },
          {x: Date.now() + 90, y: -144 },
          {x: Date.now() + 95, y: -352},
          {x: Date.now() + 100, y: -664 },
          {x: Date.now() + 105, y: -768 },
          {x: Date.now() + 110, y: -872 },
          {x: Date.now() + 115, y: -976 },
          {x: Date.now() + 120, y: -1100 },
          {x: Date.now() + 130, y: -1184 },
          {x: Date.now() + 135, y: -1288 },
          {x: Date.now() + 140, y: -872 },
          {x: Date.now() + 145, y: -768 },
          {x: Date.now() + 150, y: -664 },
          {x: Date.now() + 155, y: -352},
          {x: Date.now() + 160, y: -144 },
          {x: Date.now() + 165, y: -40 }
        ];
        const ecgArray = [...pulseArray];
        newECGData.push(...ecgArray);
      } else {
        // Pulse input is outside the specified range, do not add a new ECG data point
        return;
      }

      if (newECGData.length > 1000) {
        newECGData.shift();
      }
      setECGData(newECGData);
    }, 100);

    return () => clearInterval(interval);
  }, [ecgData]);

  // Helper function to display values with fallback
  const displayValue = (value, fallback = "--") => {
    if (value === null || value === undefined || value === "" || isNaN(value)) {
      return fallback;
    }
    return value;
  };

  // Get connection status display info
  const getConnectionStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return { text: 'Online', color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'sensor_offline':
        return { text: 'Sensor Offline', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
      case 'network_offline':
        return { text: 'Network Offline', color: 'text-red-500', bgColor: 'bg-red-100' };
      case 'connecting':
        return { text: 'Connecting...', color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 'error':
        return { text: 'Connection Error', color: 'text-red-500', bgColor: 'bg-red-100' };
      case 'device_not_found':
        return { text: 'Device Not Found', color: 'text-red-500', bgColor: 'bg-red-100' };
      default:
        return { text: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const statusInfo = getConnectionStatusInfo();

  return (
    <>
      {/* Enhanced Status Bar */}
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="flex items-center">
              Device status:
              <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                {statusInfo.text}
              </span>
            </p>
            {lastUpdated && connectionStatus === 'connected' && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Retry Button */}
          {error && (
            <button
              onClick={retryConnection}
              disabled={loading || isRetrying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loading || isRetrying
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {loading || isRetrying ? 'Retrying...' : 'Retry Connection'}
            </button>
          )}
        </div>

        {/* Error Message Banner */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <span className="text-red-400">⚠️</span>
              <p className="ml-2 text-sm text-red-700">
                {error.message || 'Connection error occurred'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Offline Modal */}
      {(!deviceStatus || error) && (
        <div className="fixed flex md:p-0 p-2 flex-col inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 md:mx-auto flex justify-between items-center flex-col w-auto md:w-1/3 h-auto rounded-lg shadow-xl p-6 bg-white dark:bg-gray-800">
            <div className="text-center">
              <h1 className="text-xl mt-2 mx-4 text-gray-700 dark:text-gray-300 font-semibold">
                {error ? 'Connection Error' : 'Device Offline'}
              </h1>

              <p className="mx-4 py-4 text-gray-600 dark:text-gray-400">
                {error ? (
                  <>
                    {error.type === ERROR_TYPES.NETWORK_ERROR && 'Please check your internet connection.'}
                    {error.type === ERROR_TYPES.SENSOR_DISCONNECTED && 'Sensor appears to be disconnected. Please check device connection.'}
                    {error.type === ERROR_TYPES.FIREBASE_ERROR && 'Database connection failed. Please try again.'}
                    {error.type === ERROR_TYPES.TIMEOUT_ERROR && 'Connection timed out. Please check sensor and network.'}
                    {error.type === ERROR_TYPES.DATA_FETCH_ERROR && 'Unable to fetch sensor data. Please try again.'}
                  </>
                ) : (
                  'Please make sure your device is connected to WiFi and powered on.'
                )}
              </p>

              {/* Connection Status Indicators */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${checkNetworkStatus() ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span>Internet: {checkNetworkStatus() ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span>Database: {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${deviceStatus ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span>Sensor: {deviceStatus ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <button
                onClick={retryConnection}
                disabled={loading || isRetrying}
                className={`mt-4 px-6 py-2 rounded-md font-medium transition-colors ${
                  loading || isRetrying
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading || isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            </div>

            <img src="/offline.gif" alt="Device offline" className="mt-4 max-w-32" />
          </div>
        </div>
      )}

      <div className="w-full h-full py-2">
        <div className='flex flex-col md:flex-row gap-4 mx-2 md:mx-8 text-gray6 dark:text-gray1'>
          {/* ECG Chart */}
          <div className='basis-3/4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
            <div className='basis-1/12 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='basis-1/4 p-4 font-semibold'>
                Heart Rhythm
                <span className="text-sm text-gray-500 ml-2">
                  {loading ? '(Loading...)' : error ? '(Error)' : '(Live)'}
                </span>
              </h2>
            </div>
            <div className='basis-11/12'>
              {!deviceStatus || error ? (
                <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-500">
                      {loading ? 'Loading ECG data...' : 'No ECG data available'}
                    </p>
                  </div>
                </div>
              ) : (
                <ApexCharts options={options} series={[{ data: ecgData }]} type="line" height={450} />
              )}
            </div>
          </div>

          {/* Health Metrics */}
          <div className='basis-1/4 flex flex-col gap-4'>
            {/* BPM Card */}
            <div className='basis-1/3 p-4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
              {data.finger && deviceStatus && !error ? (
                <>
                  <h2 className='basis-1/4 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                    BPM <span className="text-xs">(Beats per minute)</span>
                  </h2>
                  <h1 className='basis-3/4 text-4xl lg:text-6xl text-center py-4 font-bold text-blue-600'>
                    {displayValue(data.beatsPerMinute)}
                  </h1>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💓</div>
                    <h2 className='text-lg text-center text-gray-400'>
                      {error ? 'Data unavailable' : !data.finger ? 'Please wear health kit!' : 'No signal'}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* SPO2 Card */}
            <div className='basis-1/3 p-4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
              {data.finger && deviceStatus && !error ? (
                <>
                  <h2 className='basis-1/4 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                    SPO2 <span className="text-xs">(Oxygen %)</span>
                  </h2>
                  <h1 className='basis-3/4 text-4xl lg:text-6xl text-center py-4 font-bold text-green-600'>
                    {displayValue(data.oxygen)}
                  </h1>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🫁</div>
                    <h2 className='text-lg text-center text-gray-400'>
                      {error ? 'Data unavailable' : !data.finger ? 'Please wear health kit!' : 'No signal'}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* Temperature Card */}
            <div className='basis-1/3 p-4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
              {data.finger && deviceStatus && !error ? (
                <>
                  <h2 className='basis-1/4 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                    Temperature <span className="text-xs">(°F)</span>
                  </h2>
                  <h1 className='basis-3/4 text-4xl lg:text-6xl text-center py-4 font-bold text-orange-600'>
                    {displayValue(data.temp)}
                  </h1>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌡️</div>
                    <h2 className='text-lg text-center text-gray-400'>
                      {error ? 'Data unavailable' : !data.finger ? 'Please wear health kit!' : 'No signal'}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
