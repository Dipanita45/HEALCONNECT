
import Joi from 'joi';
import { dbOperations, where, orderBy, limit } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling, withMethods, withAuth, validate, rateLimit, compose } from '../../../lib/api/middleware';

// Validation Schemas
const createPatientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).optional(),
  age: Joi.number().integer().min(0).max(150).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  address: Joi.string().max(200).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  doctorId: Joi.string().required(), // Ensure patient is assigned to a doctor
});

const getPatientsSchema = Joi.object({
  doctorId: Joi.string().optional(),
  status: Joi.string().valid('Admitted', 'Discharged', 'Critical').optional(),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPatients(req, res);
    case 'POST':
      return await createPatient(req, res);
    default:
      // This should be handled by withMethods, but as a fallback
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getPatients(req, res) {
  // Configurable query from validated query params
  const { doctorId, status, limit: queryLimit } = req.query;

  const constraints = [];

  // Security: If user is a doctor, force them to see only their patients?
  // For now, if doctorId is provided, filter by it.
  // Ideally, req.user.uid should be used if the user IS a doctor.

  if (doctorId) {
    constraints.push(where('doctorId', '==', doctorId));
  }
  if (status) {
    constraints.push(where('status', '==', status));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  if (queryLimit) {
    constraints.push(limit(Number(queryLimit)));
  }
  const result = await dbOperations.getAll(Collections.PATIENTS, constraints);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    throw new Error(result.error);
  }
}

async function createPatient(req, res) {
  const patientData = req.body;
  // Input already validated by middleware

  // Add metadata
  const dataToSave = {
    ...patientData,
    createdBy: req.user.uid, // Audit trail
  };

  const result = await dbOperations.create(Collections.PATIENTS, dataToSave);

  if (result.success) {
    res.status(201).json({ success: true, id: result.id });
  } else {
    throw new Error(result.error);
  }
}

// Composition of Middlewares
// 1. Error Handling (Outer)
// 2. Rate Limiting
// 3. Auth
// 4. Method Check
// 5. Validation (Specific to method, need to dispatch inside handler or use router-like logic)
// Since Next.js API routes are single-file, we can't easily split validation per method at the top level without a router.
// So we will validate INSIDE the handler or wrap specific sub-functions.

// Alternative approach: specific handlers per method wrapped with validation
const secureHandler = async (req, res) => {
  if (req.method === 'POST') {
    // Validate Body
    const { error, value } = createPatientSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.body = value;
    return createPatient(req, res);
  }

  if (req.method === 'GET') {
    // Validate Query
    const { error, value } = getPatientsSchema.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    req.query = value;
    return getPatients(req, res);
  }

  return handler(req, res);
}


export default compose(
  withErrorHandling,
  rateLimit,
  withAuth,
  (h) => withMethods(['GET', 'POST'], h)
)(secureHandler);

