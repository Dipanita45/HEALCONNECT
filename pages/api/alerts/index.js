
import Joi from 'joi';
import { dbOperations, where, orderBy, limit } from '../../../lib/db/operations';
import { Collections, AlertSeverity } from '../../../lib/db/schema';
import { withErrorHandling, withMethods, withAuth, validate, rateLimit, compose } from '../../../lib/api/middleware';

// Validation Schemas
const createAlertSchema = Joi.object({
  patientId: Joi.string().required(),
  doctorId: Joi.string().optional(),
  message: Joi.string().required().min(5).max(500),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  acknowledged: Joi.boolean().default(false),
  timestamp: Joi.string().isoDate().optional(),
});

const getAlertsSchema = Joi.object({
  patientId: Joi.string().optional(),
  doctorId: Joi.string().optional(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  acknowledged: Joi.boolean().optional(),
  limit: Joi.number().integer().min(1).max(100).default(50),
});

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
    constraints.push(where('acknowledged', '==', acknowledged));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(parseInt(queryLimit)));

  const result = await dbOperations.getAll(Collections.ALERTS, constraints);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    throw new Error(result.error);
  }
}

async function createAlert(req, res) {
  const alertData = req.body;
  // Validated by middleware

  const dataToSave = {
    ...alertData,
    acknowledged: alertData.acknowledged || false,
    timestamp: alertData.timestamp || new Date().toISOString(),
    createdBy: req.user.uid
  };

  const result = await dbOperations.create(Collections.ALERTS, dataToSave);

  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    throw new Error(result.error);
  }
}

const secureHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { error, value } = createAlertSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.body = value;
    return createAlert(req, res);
  }

  if (req.method === 'GET') {
    const { error, value } = getAlertsSchema.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.query = value;
    return getAlerts(req, res);
  }

  return handler(req, res);
}

export default compose(
  withErrorHandling,
  rateLimit,
  withAuth,
  (h) => withMethods(['GET', 'POST'], h)
)(secureHandler);

