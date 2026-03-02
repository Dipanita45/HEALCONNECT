'use client'
import { useState, useEffect, useCallback } from 'react'
import { offlineManager } from '@/lib/offlineDataManager'

export function useOfflineSync(patientId) {
  const [syncStatus, setSyncStatus] = useState('idle')
  const [lastSyncTime, setLastSyncTime] = useState(null)
  const [unsyncedCount, setUnsyncedCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

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

  useEffect(() => {
    if (patientId) {
      updateUnsyncedCount()
      const interval = setInterval(updateUnsyncedCount, 5000)
      return () => clearInterval(interval)
    }
  }, [patientId])

  const updateUnsyncedCount = useCallback(async () => {
    try {
      const unsynced = await offlineManager.getUnsyncedData()
      const total = unsynced.vitals.length + unsynced.contacts.length +
        unsynced.records.length + unsynced.medications.length
      setUnsyncedCount(total)
    } catch (error) {
      console.error('Failed to update unsynced count:', error)
    }
  }, [])

  const syncData = useCallback(async () => {
    if (!isOnline) return

    try {
      setSyncStatus('syncing')

      const unsynced = await offlineManager.getUnsyncedData()

      // Sync vitals
      for (const vital of unsynced.vitals) {
        try {
          // Replace with your actual API call
          // await api.savePatientVitals(vital)
          await offlineManager.markAsSynced('patientVitals', vital.id)
        } catch (error) {
          console.error('Failed to sync vital:', error)
        }
      }

      // Sync emergency contacts
      for (const contact of unsynced.contacts) {
        try {
          // Replace with your actual API call
          // await api.saveEmergencyContact(contact)
          await offlineManager.markAsSynced('emergencyContacts', contact.id)
        } catch (error) {
          console.error('Failed to sync contact:', error)
        }
      }

      // Sync medical records
      for (const record of unsynced.records) {
        try {
          // Replace with your actual API call
          // await api.saveMedicalRecord(record)
          await offlineManager.markAsSynced('medicalRecords', record.id)
        } catch (error) {
          console.error('Failed to sync record:', error)
        }
      }

      // Sync medications
      for (const medication of unsynced.medications) {
        try {
          // Replace with your actual API call
          // await api.saveMedication(medication)
          await offlineManager.markAsSynced('medications', medication.id)
        } catch (error) {
          console.error('Failed to sync medication:', error)
        }
      }

      setSyncStatus('synced')
      setLastSyncTime(new Date())
      await updateUnsyncedCount()

      // Reset to online status after successful sync
      setTimeout(() => setSyncStatus('online'), 2000)

    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus('error')
    }
  }, [isOnline, updateUnsyncedCount])

  const saveOfflineVitals = useCallback(async (vitals) => {
    try {
      await offlineManager.savePatientVitals(vitals)
      await updateUnsyncedCount()
      return true
    } catch (error) {
      console.error('Failed to save vitals offline:', error)
      return false
    }
  }, [updateUnsyncedCount])

  const saveOfflineContact = useCallback(async (contact) => {
    try {
      await offlineManager.saveEmergencyContact(contact)
      await updateUnsyncedCount()
      return true
    } catch (error) {
      console.error('Failed to save contact offline:', error)
      return false
    }
  }, [updateUnsyncedCount])

  const saveOfflineRecord = useCallback(async (record) => {
    try {
      await offlineManager.saveMedicalRecord(record)
      await updateUnsyncedCount()
      return true
    } catch (error) {
      console.error('Failed to save record offline:', error)
      return false
    }
  }, [updateUnsyncedCount])

  const saveOfflineMedication = useCallback(async (medication) => {
    try {
      await offlineManager.saveMedication(medication)
      await updateUnsyncedCount()
      return true
    } catch (error) {
      console.error('Failed to save medication offline:', error)
      return false
    }
  }, [updateUnsyncedCount])

  const getOfflineVitals = useCallback(async (limit = 50) => {
    try {
      return await offlineManager.getPatientVitals(patientId, limit)
    } catch (error) {
      console.error('Failed to get offline vitals:', error)
      return []
    }
  }, [patientId])

  const getOfflineContacts = useCallback(async () => {
    try {
      return await offlineManager.getEmergencyContacts(patientId)
    } catch (error) {
      console.error('Failed to get offline contacts:', error)
      return []
    }
  }, [patientId])

  const getOfflineMedications = useCallback(async () => {
    try {
      return await offlineManager.getMedications(patientId)
    } catch (error) {
      console.error('Failed to get offline medications:', error)
      return []
    }
  }, [patientId])

  return {
    syncStatus,
    lastSyncTime,
    unsyncedCount,
    isOnline,
    syncData,
    saveOfflineVitals,
    saveOfflineContact,
    saveOfflineRecord,
    saveOfflineMedication,
    getOfflineVitals,
    getOfflineContacts,
    getOfflineMedications
  }
}
