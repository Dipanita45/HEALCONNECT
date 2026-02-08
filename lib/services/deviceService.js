// Device Service Layer
import apiClient from '../api/apiClient';
import { dbOperations, where } from '../db/operations';
import { Collections } from '../db/schema';

export const deviceService = {
  // Register new device
  async register(deviceData) {
    return await apiClient.post('/devices', deviceData);
  },

  // Get all devices
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await apiClient.get(`/devices${params ? `?${params}` : ''}`);
  },

  // Get devices for a patient
  async getByPatient(patientId) {
    return await apiClient.get(`/devices?patientId=${patientId}`);
  },

  // Get active devices
  async getActive() {
    return await apiClient.get('/devices?active=true');
  },

  // Update device status
  async updateStatus(deviceId, status) {
    const result = await dbOperations.queryDocuments(
      Collections.DEVICES,
      [where('deviceId', '==', deviceId)]
    );

    if (result.success && result.data.length > 0) {
      const device = result.data[0];
      return await dbOperations.update(Collections.DEVICES, device.id, {
        status,
        lastSeen: new Date().toISOString()
      });
    }

    return { success: false, error: 'Device not found' };
  },

  // Update device last seen
  async updateLastSeen(deviceId) {
    const result = await dbOperations.queryDocuments(
      Collections.DEVICES,
      [where('deviceId', '==', deviceId)]
    );

    if (result.success && result.data.length > 0) {
      const device = result.data[0];
      return await dbOperations.update(Collections.DEVICES, device.id, {
        lastSeen: new Date().toISOString()
      });
    }

    return { success: false, error: 'Device not found' };
  },

  // Check device connectivity
  async checkConnectivity(deviceId) {
    const result = await dbOperations.queryDocuments(
      Collections.DEVICES,
      [where('deviceId', '==', deviceId)]
    );

    if (result.success && result.data.length > 0) {
      const device = result.data[0];
      const lastSeen = new Date(device.lastSeen);
      const now = new Date();
      const minutesSinceLastSeen = (now - lastSeen) / 1000 / 60;

      return {
        success: true,
        connected: minutesSinceLastSeen < 5,
        lastSeen: device.lastSeen,
        minutesSinceLastSeen: Math.round(minutesSinceLastSeen)
      };
    }

    return { success: false, error: 'Device not found' };
  }
};

export default deviceService;
