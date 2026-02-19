// API Routes for Single Alert
import { dbOperations } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';
import { withErrorHandling } from '../../../lib/api/middleware';

async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      return await getAlert(id, res);
    case 'PATCH':
      return await acknowledgeAlert(id, req.body, res);
    case 'DELETE':
      return await deleteAlert(id, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function getAlert(id, res) {
  const result = await dbOperations.getById(Collections.ALERTS, id);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(404).json({ success: false, message: result.error });
  }
}

async function acknowledgeAlert(id, data, res) {
  const updateData = {
    acknowledged: true,
    acknowledgedAt: new Date().toISOString(),
    acknowledgedBy: data.acknowledgedBy || null,
  };

  const result = await dbOperations.update(Collections.ALERTS, id, updateData);

  if (result.success) {
    res.status(200).json({ success: true, message: 'Alert acknowledged' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

async function deleteAlert(id, res) {
  const result = await dbOperations.delete(Collections.ALERTS, id);

  if (result.success) {
    res.status(200).json({ success: true, message: 'Alert deleted' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}

export default withErrorHandling(handler);
