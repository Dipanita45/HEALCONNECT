// API Routes for Devices
import { dbOperations, where, orderBy } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getDevices(req, res);
    case 'POST':
      return await registerDevice(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getDevices(req, res) {
  const { patientId, status, active } = req.query;

  const constraints = [];

  if (patientId) {
    constraints.push(where('patientId', '==', patientId));
  }
  if (status) {
    constraints.push(where('status', '==', status));
  }
  if (active !== undefined) {
    constraints.push(where('active', '==', active === 'true'));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const result = await dbOperations.getAll(Collections.DEVICES, constraints);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function registerDevice(req, res) {
  const deviceData = req.body;

  // Validate required fields
  if (!deviceData.deviceId || !deviceData.patientId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID and Patient ID are required',
    });
  }

  // Set default values
  deviceData.active = deviceData.active !== undefined ? deviceData.active : true;
  deviceData.status = deviceData.status || 'active';
  deviceData.lastSeen = new Date().toISOString();

  const result = await dbOperations.create(Collections.DEVICES, deviceData);

  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
