// API Routes for Vitals
import { dbOperations, where, orderBy, limit } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getVitals(req, res);
    case 'POST':
      return await createVital(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getVitals(req, res) {
  const { patientId, deviceId, startDate, endDate, limit: queryLimit = 100 } = req.query;
  
  const constraints = [];
  
  if (patientId) {
    constraints.push(where('patientId', '==', patientId));
  }
  if (deviceId) {
    constraints.push(where('deviceId', '==', deviceId));
  }
  
  constraints.push(orderBy('timestamp', 'desc'));
  constraints.push(limit(parseInt(queryLimit)));
  
  const result = await dbOperations.getAll(Collections.VITALS, constraints);
  
  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function createVital(req, res) {
  const vitalData = req.body;
  
  // Validate required fields
  if (!vitalData.patientId || !vitalData.deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Patient ID and Device ID are required',
    });
  }

  // Add timestamp if not provided
  if (!vitalData.timestamp) {
    vitalData.timestamp = new Date().toISOString();
  }

  const result = await dbOperations.create(Collections.VITALS, vitalData);
  
  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
