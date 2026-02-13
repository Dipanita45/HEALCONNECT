// API Routes for Single Patient
import { dbOperations } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      return await getPatient(id, res);
    case 'PUT':
      return await updatePatient(id, req.body, res);
    case 'DELETE':
      return await deletePatient(id, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getPatient(id, res) {
  const result = await dbOperations.getById(Collections.PATIENTS, id);
  
  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(404).json({ success: false, message: result.error });
  }
}

async function updatePatient(id, data, res) {
  const result = await dbOperations.update(Collections.PATIENTS, id, data);
  
  if (result.success) {
    res.status(200).json({ success: true, message: 'Patient updated successfully' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function deletePatient(id, res) {
  const result = await dbOperations.delete(Collections.PATIENTS, id);
  
  if (result.success) {
    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
