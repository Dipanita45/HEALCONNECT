import { dbOperations } from '../../lib/db/operations';

jest.mock('../../lib/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  onSnapshot: jest.fn(),
  getCountFromServer: jest.fn(),
  runTransaction: jest.fn()
}));

const {
  collection,
  doc,
  runTransaction
} = require('firebase/firestore');

describe('dbOperations.executeUnitOfWork', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('commits related operations in a single transaction', async () => {
    collection.mockImplementation((dbArg, collectionName) => ({ kind: 'collection', collectionName }));
    doc
      .mockImplementationOnce((dbArg, collectionName, id) => ({ id, path: `${collectionName}/${id}` }))
      .mockImplementationOnce((collectionRef) => ({ id: 'alert-1', path: `${collectionRef.collectionName}/alert-1` }))
      .mockImplementationOnce((dbArg, collectionName, id) => ({ id, path: `${collectionName}/${id}` }));

    const transaction = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          exists: () => true,
          id: 'patient-1',
          data: () => ({ status: 'stable' })
        }),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    runTransaction.mockImplementation(async (dbArg, callback) => callback(transaction));

    const result = await dbOperations.executeUnitOfWork(async (uow) => {
      const patient = await uow.getById('patients', 'patient-1');

      await uow.update('patients', 'patient-1', { status: 'critical' });
      const alert = await uow.create('alerts', { patientId: patient.id, severity: 'critical' });
      await uow.set('auditLogs', 'audit-1', {
        action: 'patient_status_updated',
        alertId: alert.id
      });

      return { patientId: patient.id, alertId: alert.id };
    });

    expect(runTransaction).toHaveBeenCalledTimes(1);
    expect(transaction.get).toHaveBeenCalledTimes(1);
    expect(transaction.update).toHaveBeenCalledWith(
      { id: 'patient-1', path: 'patients/patient-1' },
      { status: 'critical', updatedAt: 'SERVER_TIMESTAMP' }
    );
    expect(transaction.set).toHaveBeenNthCalledWith(
      1,
      { id: 'alert-1', path: 'alerts/alert-1' },
      {
        patientId: 'patient-1',
        severity: 'critical',
        createdAt: 'SERVER_TIMESTAMP',
        updatedAt: 'SERVER_TIMESTAMP'
      }
    );
    expect(transaction.set).toHaveBeenNthCalledWith(
      2,
      { id: 'audit-1', path: 'auditLogs/audit-1' },
      {
        action: 'patient_status_updated',
        alertId: 'alert-1',
        updatedAt: 'SERVER_TIMESTAMP'
      },
      { merge: true }
    );
    expect(result).toEqual({
      success: true,
      data: { patientId: 'patient-1', alertId: 'alert-1' }
    });
  });

  test('returns a failure response when the transaction aborts', async () => {
    runTransaction.mockRejectedValue(new Error('transaction aborted'));

    const result = await dbOperations.executeUnitOfWork(async (uow) => {
      await uow.update('patients', 'patient-1', { status: 'critical' });
    });

    expect(result).toEqual({
      success: false,
      error: 'transaction aborted'
    });
  });
});
