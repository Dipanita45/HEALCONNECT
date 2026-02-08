// Patient Service Layer
import { dbOperations, where, orderBy } from '../db/operations';
import { Collections } from '../db/schema';
import apiClient from '../api/apiClient';

export const patientService = {
  // Get all patients
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiClient.get(`/patients${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get patient by ID
  async getById(id) {
    return await apiClient.get(`/patients/${id}`);
  },

  // Create new patient
  async create(patientData) {
    return await apiClient.post('/patients', patientData);
  },

  // Update patient
  async update(id, patientData) {
    return await apiClient.put(`/patients/${id}`, patientData);
  },

  // Delete patient
  async delete(id) {
    return await apiClient.delete(`/patients/${id}`);
  },

  // Get patient vitals
  async getVitals(patientId, limit = 100) {
    return await apiClient.get(`/vitals?patientId=${patientId}&limit=${limit}`);
  },

  // Get patient alerts
  async getAlerts(patientId, acknowledged = false) {
    return await apiClient.get(`/alerts?patientId=${patientId}&acknowledged=${acknowledged}`);
  },

  // Subscribe to patient updates (real-time)
  subscribeToPatient(patientId, callback) {
    return dbOperations.subscribe(
      Collections.PATIENTS,
      (patients) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) callback(patient);
      },
      [where('id', '==', patientId)]
    );
  },

  // Subscribe to patient vitals (real-time)
  subscribeToVitals(patientId, callback) {
    return dbOperations.subscribe(
      Collections.VITALS,
      callback,
      [
        where('patientId', '==', patientId),
        orderBy('timestamp', 'desc')
      ]
    );
  }
};

export default patientService;
