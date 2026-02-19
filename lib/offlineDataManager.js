'use client'
import { useState, useEffect } from 'react'

class OfflineDataManager {
  constructor() {
    this.dbName = 'HEALCONNECT_OfflineDB'
    this.dbVersion = 1
    this.db = null
    this.initDB()
  }

  async initDB() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result
          
          // Store patient vitals
          if (!db.objectStoreNames.contains('patientVitals')) {
            const vitalsStore = db.createObjectStore('patientVitals', { keyPath: 'id', autoIncrement: true })
            vitalsStore.createIndex('patientId', 'patientId', { unique: false })
            vitalsStore.createIndex('timestamp', 'timestamp', { unique: false })
          }
          
          // Store emergency contacts
          if (!db.objectStoreNames.contains('emergencyContacts')) {
            const contactsStore = db.createObjectStore('emergencyContacts', { keyPath: 'id', autoIncrement: true })
            contactsStore.createIndex('patientId', 'patientId', { unique: false })
            contactsStore.createIndex('priority', 'priority', { unique: false })
          }
          
          // Store medical records
          if (!db.objectStoreNames.contains('medicalRecords')) {
            const recordsStore = db.createObjectStore('medicalRecords', { keyPath: 'id', autoIncrement: true })
            recordsStore.createIndex('patientId', 'patientId', { unique: false })
            recordsStore.createIndex('recordType', 'recordType', { unique: false })
            recordsStore.createIndex('timestamp', 'timestamp', { unique: false })
          }
          
          // Store medications
          if (!db.objectStoreNames.contains('medications')) {
            const medsStore = db.createObjectStore('medications', { keyPath: 'id', autoIncrement: true })
            medsStore.createIndex('patientId', 'patientId', { unique: false })
            medsStore.createIndex('name', 'name', { unique: false })
          }
        }
      })
    } catch (error) {
      console.error('Failed to initialize offline database:', error)
    }
  }

  async savePatientVitals(vitals) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['patientVitals'], 'readwrite')
      const store = transaction.objectStore('patientVitals')
      
      const vitalsWithTimestamp = {
        ...vitals,
        timestamp: new Date().toISOString(),
        synced: false
      }
      
      await store.add(vitalsWithTimestamp)
      return vitalsWithTimestamp
    } catch (error) {
      console.error('Failed to save patient vitals:', error)
      throw error
    }
  }

  async getPatientVitals(patientId, limit = 50) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['patientVitals'], 'readonly')
      const store = transaction.objectStore('patientVitals')
      const index = store.index('patientId')
      
      const vitals = await new Promise((resolve, reject) => {
        const request = index.getAll(patientId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      return vitals
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to get patient vitals:', error)
      return []
    }
  }

  async saveEmergencyContact(contact) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['emergencyContacts'], 'readwrite')
      const store = transaction.objectStore('emergencyContacts')
      
      const contactWithTimestamp = {
        ...contact,
        timestamp: new Date().toISOString(),
        synced: false
      }
      
      await store.add(contactWithTimestamp)
      return contactWithTimestamp
    } catch (error) {
      console.error('Failed to save emergency contact:', error)
      throw error
    }
  }

  async getEmergencyContacts(patientId) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['emergencyContacts'], 'readonly')
      const store = transaction.objectStore('emergencyContacts')
      const index = store.index('patientId')
      
      const contacts = await new Promise((resolve, reject) => {
        const request = index.getAll(patientId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      return contacts.sort((a, b) => a.priority - b.priority)
    } catch (error) {
      console.error('Failed to get emergency contacts:', error)
      return []
    }
  }

  async saveMedicalRecord(record) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['medicalRecords'], 'readwrite')
      const store = transaction.objectStore('medicalRecords')
      
      const recordWithTimestamp = {
        ...record,
        timestamp: new Date().toISOString(),
        synced: false
      }
      
      await store.add(recordWithTimestamp)
      return recordWithTimestamp
    } catch (error) {
      console.error('Failed to save medical record:', error)
      throw error
    }
  }

  async getMedicalRecords(patientId, recordType = null) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['medicalRecords'], 'readonly')
      const store = transaction.objectStore('medicalRecords')
      const patientIndex = store.index('patientId')
      
      const records = await new Promise((resolve, reject) => {
        const request = patientIndex.getAll(patientId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      let filteredRecords = records
      if (recordType) {
        filteredRecords = records.filter(record => record.recordType === recordType)
      }
      
      return filteredRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Failed to get medical records:', error)
      return []
    }
  }

  async saveMedication(medication) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['medications'], 'readwrite')
      const store = transaction.objectStore('medications')
      
      const medicationWithTimestamp = {
        ...medication,
        timestamp: new Date().toISOString(),
        synced: false
      }
      
      await store.add(medicationWithTimestamp)
      return medicationWithTimestamp
    } catch (error) {
      console.error('Failed to save medication:', error)
      throw error
    }
  }

  async getMedications(patientId) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction(['medications'], 'readonly')
      const store = transaction.objectStore('medications')
      const index = store.index('patientId')
      
      const medications = await new Promise((resolve, reject) => {
        const request = index.getAll(patientId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      return medications.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Failed to get medications:', error)
      return []
    }
  }

  async getUnsyncedData() {
    if (!this.db) await this.initDB()
    
    try {
      const unsynced = {
        vitals: await this.getUnsyncedItems('patientVitals'),
        contacts: await this.getUnsyncedItems('emergencyContacts'),
        records: await this.getUnsyncedItems('medicalRecords'),
        medications: await this.getUnsyncedItems('medications')
      }
      
      return unsynced
    } catch (error) {
      console.error('Failed to get unsynced data:', error)
      return { vitals: [], contacts: [], records: [], medications: [] }
    }
  }

  async getUnsyncedItems(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const items = request.result.filter(item => !item.synced)
        resolve(items)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async markAsSynced(storeName, itemId) {
    if (!this.db) await this.initDB()
    
    try {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const item = await new Promise((resolve, reject) => {
        const request = store.get(itemId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      if (item) {
        item.synced = true
        item.syncedAt = new Date().toISOString()
        await store.put(item)
      }
    } catch (error) {
      console.error(`Failed to mark ${storeName} item as synced:`, error)
    }
  }

  async clearAllData() {
    if (!this.db) await this.initDB()
    
    try {
      const stores = ['patientVitals', 'emergencyContacts', 'medicalRecords', 'medications']
      
      for (const storeName of stores) {
        const transaction = this.db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        await store.clear()
      }
      
      console.log('All offline data cleared')
    } catch (error) {
      console.error('Failed to clear offline data:', error)
    }
  }

  getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate().then(estimate => ({
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota - estimate.usage,
        percentageUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
      }))
    }
    return Promise.resolve({ quota: 0, usage: 0, available: 0, percentageUsed: 0 })
  }
}

function createNoopManager() {
  const warn = (...args) => console.warn('[offlineManager] unavailable on server:', ...args)
  return {
    savePatientVitals: async (v) => { warn('savePatientVitals called'); return v },
    getPatientVitals: async () => { warn('getPatientVitals called'); return [] },
    saveEmergencyContact: async (c) => { warn('saveEmergencyContact called'); return c },
    getEmergencyContacts: async () => { warn('getEmergencyContacts called'); return [] },
    saveMedicalRecord: async (r) => { warn('saveMedicalRecord called'); return r },
    getMedicalRecords: async () => { warn('getMedicalRecords called'); return [] },
    saveMedication: async (m) => { warn('saveMedication called'); return m },
    getMedications: async () => { warn('getMedications called'); return [] },
    getUnsyncedData: async () => { warn('getUnsyncedData called'); return { vitals: [], contacts: [], records: [], medications: [] } },
    getUnsyncedItems: async () => { warn('getUnsyncedItems called'); return [] },
    markAsSynced: async () => { warn('markAsSynced called'); return },
    clearAllData: async () => { warn('clearAllData called'); return },
    getStorageInfo: async () => { warn('getStorageInfo called'); return { quota: 0, usage: 0, available: 0, percentageUsed: 0 } }
  }
}

// Only instantiate the real manager in browser environments where indexedDB exists.
export const offlineManager = (typeof window !== 'undefined' && typeof indexedDB !== 'undefined')
  ? new OfflineDataManager()
  : createNoopManager()

export default OfflineDataManager
