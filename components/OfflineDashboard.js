'use client'
import { useState, useEffect } from 'react'
import { FaHeartbeat, FaPhoneAlt, FaUserMd, FaPills, FaSync, FaExclamationTriangle } from 'react-icons/fa'
import { MdWifiOff } from 'react-icons/md'
import { offlineManager } from '@/lib/offlineDataManager'

export default function OfflineDashboard({ patientId }) {
  const [vitals, setVitals] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [medications, setMedications] = useState([])
  const [storageInfo, setStorageInfo] = useState({ quota: 0, usage: 0, available: 0, percentageUsed: 0 })
  const [syncStatus, setSyncStatus] = useState('offline')
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (!patientId) return

    loadOfflineData()
    updateStorageInfo()

    const interval = setInterval(() => {
      updateStorageInfo()
    }, 30000) // Update storage info every 30 seconds

    return () => clearInterval(interval)
  }, [patientId])

  useEffect(() => {
    setIsOnline(navigator.onLine)

    let isMounted = true

    const handleOnline = () => {
      if (isMounted) {
        setIsOnline(true)
        setSyncStatus('syncing')
        syncData()
      }
    }

    const handleOffline = () => {
      if (isMounted) {
        setIsOnline(false)
        setSyncStatus('offline')
      }
    }

    // Periodic connectivity check (more reliable than just relying on events)
    const checkConnectivity = async () => {
      if (!isMounted) return
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        await fetch(window.location.origin + '/manifest.json', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (isMounted) {
          setIsOnline(true)
          setSyncStatus('syncing')
          syncData()
        }
      } catch (error) {
        if (isMounted) {
          setIsOnline(false)
          setSyncStatus('offline')
        }
      }
    }

    // Run connectivity check every 5 seconds
    const connectivityInterval = setInterval(checkConnectivity, 5000)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      isMounted = false
      clearInterval(connectivityInterval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineData = async () => {
    try {
      const [vitalsData, contactsData, medsData] = await Promise.all([
        offlineManager.getPatientVitals(patientId, 10),
        offlineManager.getEmergencyContacts(patientId),
        offlineManager.getMedications(patientId)
      ])

      setVitals(vitalsData)
      setEmergencyContacts(contactsData)
      setMedications(medsData)
    } catch (error) {
      console.error('Failed to load offline data:', error)
    }
  }

  const updateStorageInfo = async () => {
    try {
      const info = await offlineManager.getStorageInfo()
      setStorageInfo(info)
    } catch (error) {
      console.error('Failed to get storage info:', error)
    }
  }

  const syncData = async () => {
    try {
      // This would sync with your backend API
      // For now, we'll just mark items as synced
      const unsyncedData = await offlineManager.getUnsyncedData()

      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('online'), 1000)
    } catch (error) {
      console.error('Failed to sync data:', error)
      setSyncStatus('sync-error')
    }
  }

  const getLatestVitals = () => {
    if (vitals.length === 0) return null
    return vitals[0] // Most recent vitals
  }

  const getStorageColor = () => {
    const percentage = parseFloat(storageInfo.percentageUsed)
    if (percentage < 50) return 'text-green-600'
    if (percentage < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const latestVitals = getLatestVitals()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Offline Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MdWifiOff className="text-3xl animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold">Offline Mode</h1>
              <p className="text-orange-100">Critical healthcare data is available offline</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${syncStatus === 'offline' ? 'bg-white/20' :
                syncStatus === 'syncing' ? 'bg-yellow-400 text-gray-900' :
                  syncStatus === 'synced' ? 'bg-green-400 text-gray-900' :
                    'bg-red-400 text-white'
              }`}>
              {syncStatus === 'offline' && <MdWifiOff />}
              {syncStatus === 'syncing' && <FaSync className="animate-spin" />}
              {syncStatus === 'synced' && <FaSync />}
              {syncStatus === 'sync-error' && <FaExclamationTriangle />}
              <span className="capitalize">{syncStatus.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Vitals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FaHeartbeat className="text-red-600" />
                <span>Latest Vitals</span>
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {vitals.length} records cached
              </span>
            </div>

            {latestVitals ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {latestVitals.heartRate || '--'} bpm
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {latestVitals.bloodPressure || '--/--'}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {latestVitals.temperature || '--'}°F
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oxygen Level</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {latestVitals.oxygenLevel || '--'}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaHeartbeat className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No vitals data available offline</p>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Last updated: {latestVitals?.timestamp ? new Date(latestVitals.timestamp).toLocaleString() : 'Never'}</p>
              <p>Data cached for offline access</p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FaPhoneAlt className="text-green-600" />
                <span>Emergency Contacts</span>
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {emergencyContacts.length} contacts cached
              </span>
            </div>

            {emergencyContacts.length > 0 ? (
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={contact.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{contact.phone}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${contact.priority === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          contact.priority === 2 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                        {contact.priority === 1 ? 'Primary' : contact.priority === 2 ? 'Secondary' : 'Other'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaPhoneAlt className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No emergency contacts available offline</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Storage Info</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                  <span className={`font-medium ${getStorageColor()}`}>
                    {storageInfo.percentageUsed}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${parseFloat(storageInfo.percentageUsed) < 50 ? 'bg-green-600' :
                        parseFloat(storageInfo.percentageUsed) < 80 ? 'bg-yellow-600' :
                          'bg-red-600'
                      }`}
                    style={{ width: `${Math.min(parseFloat(storageInfo.percentageUsed), 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>{(storageInfo.usage / 1024 / 1024).toFixed(2)} MB used</p>
                <p>{(storageInfo.available / 1024 / 1024).toFixed(2)} MB available</p>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FaPills className="text-purple-600" />
                <span>Medications</span>
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {medications.length} cached
              </span>
            </div>

            {medications.length > 0 ? (
              <div className="space-y-2">
                {medications.slice(0, 5).map((med, index) => (
                  <div key={med.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{med.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{med.dosage}</p>
                  </div>
                ))}
                {medications.length > 5 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{medications.length - 5} more medications
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <FaPills className="text-2xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">No medications cached</p>
              </div>
            )}
          </div>

          {/* Sync Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              {isOnline && (
                <button
                  onClick={syncData}
                  disabled={syncStatus === 'syncing'}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaSync className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              )}

              <button
                onClick={loadOfflineData}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh Offline Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
