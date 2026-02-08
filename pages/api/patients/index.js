// API Routes for Patients
import { dbOperations, where, orderBy } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling, withMethods } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPatients(req, res);
    case 'POST':
      return await createPatient(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getPatients(req, res) {
  const { doctorId, status, limit: queryLimit } = req.query;
  
  const constraints = [];
  if (doctorId) {
    constraints.push(where('doctorId', '==', doctorId));
  }
  if (status) {
    constraints.push(where('status', '==', status));
  }
  constraints.push(orderBy('createdAt', 'desc'));
  
  const result = await dbOperations.getAll(Collections.PATIENTS, constraints);
  
  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function createPatient(req, res) {
  const patientData = req.body;
  
  // Validate required fields
  if (!patientData.name || !patientData.email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
  }

  const result = await dbOperations.create(Collections.PATIENTS, patientData);
  
  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
