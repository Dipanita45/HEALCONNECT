// Vital Signs Service Layer
import apiClient from '../api/apiClient';
import { dbOperations, where, orderBy, limit } from '../db/operations';
import { Collections } from '../db/schema';

export const vitalService = {
  // Record new vital signs
  async record(vitalData) {
    return await apiClient.post('/vitals', vitalData);
  },

  // Get vitals for a patient
  async getByPatient(patientId, options = {}) {
    const { limit: queryLimit = 100, startDate, endDate } = options;
    const params = new URLSearchParams({
      patientId,
      limit: queryLimit,
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });
    return await apiClient.get(`/vitals?${params.toString()}`);
  },

  // Get latest vitals for a patient
  async getLatest(patientId) {
    const result = await apiClient.get(`/vitals?patientId=${patientId}&limit=1`);
    return result.success && result.data.data.length > 0 
      ? { success: true, data: result.data.data[0] }
      : { success: false, error: 'No vitals found' };
  },

  // Get vitals by device
  async getByDevice(deviceId, queryLimit = 100) {
    return await apiClient.get(`/vitals?deviceId=${deviceId}&limit=${queryLimit}`);
  },

  // Subscribe to real-time vitals
  subscribeToVitals(patientId, callback, queryLimit = 50) {
    return dbOperations.subscribe(
      Collections.VITALS,
      callback,
      [
        where('patientId', '==', patientId),
        orderBy('timestamp', 'desc'),
        limit(queryLimit)
      ]
    );
  },

  // Analyze vitals for anomalies
  async analyzeVitals(patientId, vitalData) {
    // Basic threshold checking
    const alerts = [];
    
    if (vitalData.heartRate) {
      if (vitalData.heartRate > 100 || vitalData.heartRate < 60) {
        alerts.push({
          type: 'heartRate',
          value: vitalData.heartRate,
          severity: vitalData.heartRate > 120 || vitalData.heartRate < 50 ? 'high' : 'medium',
          message: `Abnormal heart rate: ${vitalData.heartRate} bpm`
        });
      }
    }

    if (vitalData.bloodPressure) {
      const [systolic, diastolic] = vitalData.bloodPressure.split('/').map(Number);
      if (systolic > 140 || diastolic > 90) {
        alerts.push({
          type: 'bloodPressure',
          value: vitalData.bloodPressure,
          severity: systolic > 160 || diastolic > 100 ? 'high' : 'medium',
          message: `High blood pressure: ${vitalData.bloodPressure}`
        });
      }
    }

    if (vitalData.oxygenSaturation && vitalData.oxygenSaturation < 95) {
      alerts.push({
        type: 'oxygenSaturation',
        value: vitalData.oxygenSaturation,
        severity: vitalData.oxygenSaturation < 90 ? 'critical' : 'high',
        message: `Low oxygen saturation: ${vitalData.oxygenSaturation}%`
      });
    }

    return alerts;
  }
};

export default vitalService;
