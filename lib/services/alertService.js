// Alert Service Layer
import apiClient from '../api/apiClient';
import { dbOperations, where, orderBy, limit } from '../db/operations';
import { Collections, AlertSeverity } from '../db/schema';

export const alertService = {
  // Create new alert
  async create(alertData) {
    return await apiClient.post('/alerts', alertData);
  },

  // Get alerts with filters
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await apiClient.get(`/alerts${params ? `?${params}` : ''}`);
  },

  // Get alert by ID
  async getById(id) {
    return await apiClient.get(`/alerts/${id}`);
  },

  // Acknowledge alert
  async acknowledge(id, acknowledgedBy) {
    return await apiClient.patch(`/alerts/${id}`, { acknowledgedBy });
  },

  // Delete alert
  async delete(id) {
    return await apiClient.delete(`/alerts/${id}`);
  },

  // Get unacknowledged alerts for a doctor
  async getUnacknowledgedForDoctor(doctorId) {
    return await apiClient.get(`/alerts?doctorId=${doctorId}&acknowledged=false`);
  },

  // Get critical alerts
  async getCriticalAlerts() {
    return await apiClient.get(`/alerts?severity=${AlertSeverity.CRITICAL}&acknowledged=false`);
  },

  // Subscribe to real-time alerts
  subscribeToAlerts(filters = {}, callback) {
    const constraints = [orderBy('createdAt', 'desc'), limit(50)];

    if (filters.patientId) {
      constraints.unshift(where('patientId', '==', filters.patientId));
    }
    if (filters.doctorId) {
      constraints.unshift(where('doctorId', '==', filters.doctorId));
    }
    if (filters.acknowledged !== undefined) {
      constraints.unshift(where('acknowledged', '==', filters.acknowledged));
    }

    return dbOperations.subscribe(Collections.ALERTS, callback, constraints);
  },

  // Create alert from vital analysis
  async createFromVitalAnalysis(patientId, doctorId, analysis) {
    const alerts = [];

    for (const anomaly of analysis) {
      const alertData = {
        patientId,
        doctorId,
        severity: anomaly.severity,
        message: anomaly.message,
        type: anomaly.type,
        value: anomaly.value,
        acknowledged: false,
        timestamp: new Date().toISOString()
      };

      const result = await this.create(alertData);
      if (result.success) {
        alerts.push(result.data);
      }
    }

    return { success: true, alerts };
  }
};

export default alertService;
