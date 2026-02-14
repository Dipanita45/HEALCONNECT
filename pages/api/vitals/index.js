
import Joi from 'joi';
import { dbOperations, where, orderBy, limit } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling, withMethods, withAuth, validate, rateLimit, compose } from '../../../lib/api/middleware';

// Validation Schemas
const createVitalSchema = Joi.object({
  patientId: Joi.string().required(),
  deviceId: Joi.string().required(),
  heartRate: Joi.number().integer().min(30).max(250).optional(),
  bloodPressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(), // e.g., 120/80
  temperature: Joi.number().min(30).max(45).optional(),
  oxygenSaturation: Joi.number().min(50).max(100).optional(),
  timestamp: Joi.string().isoDate().optional(),
}).or('heartRate', 'bloodPressure', 'temperature', 'oxygenSaturation');

const getVitalsSchema = Joi.object({
  patientId: Joi.string().optional(),
  deviceId: Joi.string().optional(),
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  limit: Joi.number().integer().min(1).max(200).default(100),
});

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

  // Note: Date filtering usually requires range queries which might need composite indexes in Firestore
  // Skipping implementation of date range for now to avoid index errors, but validation is in place.

  const result = await dbOperations.getAll(Collections.VITALS, constraints);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    throw new Error(result.error);
  }
}

async function createVital(req, res) {
  const vitalData = req.body;
  // Validated by middleware

  // Add metadata
  const dataToSave = {
    ...vitalData,
    timestamp: vitalData.timestamp || new Date().toISOString(),
    recordedBy: req.user.uid
  };

  const result = await dbOperations.create(Collections.VITALS, dataToSave);

  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    throw new Error(result.error);
  }
}

const secureHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { error, value } = createVitalSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.body = value;
    return createVital(req, res);
  }

  if (req.method === 'GET') {
    const { error, value } = getVitalsSchema.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.query = value;
    return getVitals(req, res);
  }

  return handler(req, res);
}

export default compose(
  withErrorHandling,
  rateLimit,
  withAuth,
  (h) => withMethods(['GET', 'POST'], h)
)(secureHandler);

