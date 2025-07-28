import React, { useState } from 'react';
import { useEffect } from 'react';
import FetchLiveData from '@lib/fetchLiveData';
import FetchDoctors from '@lib/fetchDoctors';
import FetchPatients from '@lib/fetchPatients';
import { useUserData } from '@lib/userInfo';
import ErrorDisplay from '@components/ErrorDisplay';
import LoadingState, { HealthMetricSkeleton, ChartSkeleton } from '@components/LoadingState';
import { ERROR_TYPES, showErrorToast, showRetryToast } from '@lib/errorHandler';

export default function ErrorHandlingDemo() {
  const [selectedTest, setSelectedTest] = useState('live-data');

  // Test different data fetching hooks
  const liveDataHook = FetchLiveData("0001");
  const doctorsHook = FetchDoctors();
  const patientsHook = FetchPatients();
  const userDataHook = useUserData();

  // Simulate different error scenarios
  const simulateError = (type) => {
    switch (type) {
      case 'network':
        showErrorToast({ message: 'Network connection lost' }, 'Network Error: Please check your internet connection');
        break;
      case 'sensor':
        showErrorToast({ message: 'Sensor disconnected' }, 'Sensor Error: Please check device connection');
        break;
      case 'firebase':
        showErrorToast({ message: 'Firebase connection failed' }, 'Database Error: Connection to database failed');
        break;
      case 'timeout':
        showErrorToast({ message: 'Request timeout' }, 'Timeout Error: Request took too long to complete');
        break;
      case 'retry':
        showRetryToast(() => {
          console.log('Retry clicked!');
        }, 'Connection failed. Click to retry.');
        break;
      default:
        showErrorToast({ message: 'Unknown error occurred' }, 'Unknown Error: Something went wrong');
    }
  };

  const renderDataSection = (title, hookData, dataKey = 'data') => {
    const { loading, error, isRetrying, retryFetch } = hookData;
    const data = hookData[dataKey];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        {loading && !data && (
          <LoadingState message={`Loading ${title.toLowerCase()}...`} />
        )}

        {error && (
          <ErrorDisplay
            error={error}
            isRetrying={isRetrying}
            onRetry={retryFetch}
            className="mb-4"
          />
        )}

        {data && (
          <div className="space-y-2">
            <div className="text-sm text-green-600">✅ Data loaded successfully</div>
            <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Error Handling & Real-time Data Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page demonstrates the comprehensive error handling system for real-time data fetching failures.
          </p>
        </div>

        {/* Error Simulation Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Simulate Error Scenarios</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => simulateError('network')}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Network Error
            </button>
            <button
              onClick={() => simulateError('sensor')}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Sensor Error
            </button>
            <button
              onClick={() => simulateError('firebase')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Database Error
            </button>
            <button
              onClick={() => simulateError('timeout')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Timeout Error
            </button>
            <button
              onClick={() => simulateError('retry')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Toast
            </button>
          </div>
        </div>

        {/* Loading State Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Default Loading</h3>
              <LoadingState message="Loading data..." />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Health Metric Skeleton</h3>
              <HealthMetricSkeleton title="Loading BPM..." />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Chart Skeleton</h3>
              <ChartSkeleton height="150px" />
            </div>
          </div>
        </div>

        {/* Error Display Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Error Display Examples</h2>
          <div className="space-y-4">
            <ErrorDisplay
              error={{ type: ERROR_TYPES.NETWORK_ERROR, message: "Internet connection lost" }}
              onRetry={() => console.log('Network retry')}
            />
            <ErrorDisplay
              error={{ type: ERROR_TYPES.SENSOR_DISCONNECTED, message: "Sensor appears to be disconnected" }}
              onRetry={() => console.log('Sensor retry')}
              size="small"
            />
            <ErrorDisplay
              error={{ type: ERROR_TYPES.FIREBASE_ERROR, message: "Database connection failed" }}
              onRetry={() => console.log('Firebase retry')}
              showRetryButton={false}
            />
          </div>
        </div>

        {/* Real Data Fetching Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDataSection("Live Sensor Data", liveDataHook, 'liveData')}
          {renderDataSection("Doctors Data", doctorsHook, 'doctors')}
          {renderDataSection("Patients Data", patientsHook, 'patients')}
          {renderDataSection("User Data", userDataHook, 'currentUser')}
        </div>

        {/* Connection Status Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                navigator.onLine ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <div>Internet</div>
              <div className="font-medium">{navigator.onLine ? 'Connected' : 'Offline'}</div>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                liveDataHook.connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <div>Live Data</div>
              <div className="font-medium capitalize">{liveDataHook.connectionStatus || 'Unknown'}</div>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                !doctorsHook.error ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <div>Doctors API</div>
              <div className="font-medium">{!doctorsHook.error ? 'Connected' : 'Error'}</div>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                !patientsHook.error ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <div>Patients API</div>
              <div className="font-medium">{!patientsHook.error ? 'Connected' : 'Error'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
