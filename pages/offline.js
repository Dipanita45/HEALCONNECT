import { useState, useEffect } from 'react'
import { FaHeartbeat, FaPhoneAlt, FaPills, FaSync, FaExclamationTriangle } from 'react-icons/fa'
import { MdWifiOff } from 'react-icons/md'
import { offlineManager } from '@/lib/offlineDataManager'

export default function OfflineFallback() {
  const [vitalsCount, setVitalsCount] = useState(0)
  const [contactsCount, setContactsCount] = useState(0)
  const [medicationsCount, setMedicationsCount] = useState(0)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const checkOfflineData = async () => {
      try {
        // Get counts of cached data
        const unsynced = await offlineManager.getUnsyncedData()
        setVitalsCount(unsynced.vitals.length)
        setContactsCount(unsynced.contacts.length)
        setMedicationsCount(unsynced.medications.length)
      } catch (error) {
        console.error('Failed to check offline data:', error)
      }
    }

    checkOfflineData()
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          {/* Offline Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <MdWifiOff className="text-3xl text-orange-600 dark:text-orange-400 animate-pulse" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No internet connection detected. Critical healthcare data is still available.
          </p>

          {/* Available Data Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center justify-center space-x-2">
              <FaHeartbeat className="text-blue-600 dark:text-blue-400" />
              <span>Available Offline Data</span>
            </h2>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{vitalsCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Vitals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{contactsCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Contacts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{medicationsCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Medications</div>
              </div>
            </div>
          </div>

          {/* Features Available */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <FaHeartbeat className="text-red-500" />
              <span>Patient vitals monitoring</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <FaPhoneAlt className="text-green-500" />
              <span>Emergency contacts access</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <FaPills className="text-purple-500" />
              <span>Medication information</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isOnline ? (
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <FaSync />
                <span>Retry Connection</span>
              </button>
            ) : (
              <div className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                <MdWifiOff />
                <span>Waiting for Connection</span>
              </div>
            )}
            
            <button
              onClick={() => window.location.href = '/patient/dashboard'}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Access Offline Dashboard
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            <p>Your data is automatically saved for offline access.</p>
            <p>When connection is restored, data will sync automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
