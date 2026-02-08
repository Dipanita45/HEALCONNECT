// API Routes for Alerts
import { dbOperations, where, orderBy, limit } from '../../../lib/db/operations';
import { Collections, AlertSeverity } from '../../../lib/db/schema';
import { withErrorHandling } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getAlerts(req, res);
    case 'POST':
      return await createAlert(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getAlerts(req, res) {
  const { 
    patientId, 
    doctorId, 
    severity, 
    acknowledged, 
    limit: queryLimit = 50 
  } = req.query;
  
  const constraints = [];
  
  if (patientId) {
    constraints.push(where('patientId', '==', patientId));
  }
  if (doctorId) {
    constraints.push(where('doctorId', '==', doctorId));
  }
  if (severity) {
    constraints.push(where('severity', '==', severity));
  }
  if (acknowledged !== undefined) {
    constraints.push(where('acknowledged', '==', acknowledged === 'true'));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(parseInt(queryLimit)));
  
  const result = await dbOperations.getAll(Collections.ALERTS, constraints);
  
  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function createAlert(req, res) {
  const alertData = req.body;
  
  // Validate required fields
  if (!alertData.patientId || !alertData.message || !alertData.severity) {
    return res.status(400).json({
      success: false,
      message: 'Patient ID, message, and severity are required',
    });
  }

  // Validate severity
  if (!Object.values(AlertSeverity).includes(alertData.severity)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid severity level',
    });
  }

  // Set default values
  alertData.acknowledged = alertData.acknowledged || false;
  alertData.timestamp = alertData.timestamp || new Date().toISOString();

  const result = await dbOperations.create(Collections.ALERTS, alertData);
  
  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
