import { checkPatientVitals, monitorAndAlert } from '../../lib/alertSystem';

// Mock Firebase to avoid actual database calls
jest.mock('../../lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  doc: jest.fn(),
  runTransaction: jest.fn(),
  Timestamp: {
    now: jest.fn(),
    fromDate: jest.fn(),
  },
}));

const {
  collection,
  doc,
  runTransaction,
  Timestamp,
} = require('firebase/firestore');

describe('Alert System Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generates alerts for critical heart rate', async () => {
    const patientData = {
      id: 'patient123',
      name: 'John Doe',
      doctorId: 'doctor456',
      heartRate: 35, // Critical low
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0]).toMatchObject({
      patientId: 'patient123',
      patientName: 'John Doe',
      doctorId: 'doctor456',
      vitalType: 'heartRate',
      vitalName: 'Heart Rate',
      currentValue: 35,
      unit: 'bpm',
      severity: 'critical',
      direction: 'low',
    });
  });

  test('generates multiple alerts for multiple abnormal vitals', async () => {
    const patientData = {
      id: 'patient123',
      name: 'Jane Smith',
      doctorId: 'doctor456',
      heartRate: 150, // Critical high
      oxygen: 85, // Critical low
      temperature: 39.5, // Critical high
      bloodPressure: '180/120', // Critical high
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    expect(result.alerts.length).toBeGreaterThan(1);

    // Check that we have alerts for different vital types
    const alertTypes = result.alerts.map(alert => alert.vitalType);
    expect(alertTypes).toContain('heartRate');
    expect(alertTypes).toContain('oxygen');
    expect(alertTypes).toContain('temperature');
    expect(alertTypes).toContain('bloodPressureSystolic');
  });

  test('does not generate alerts for normal vitals', async () => {
    const patientData = {
      id: 'patient123',
      name: 'Healthy Patient',
      doctorId: 'doctor456',
      heartRate: 75, // Normal
      oxygen: 98, // Normal
      temperature: 36.5, // Normal
      bloodPressure: '110/70', // Normal
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    expect(result.alerts).toHaveLength(0);
  });

  test('handles missing patient data gracefully', async () => {
    const result = await checkPatientVitals(null);

    expect(result.checked).toBe(false);
    expect(result.alerts).toHaveLength(0);
  });

  test('handles partial patient data', async () => {
    const patientData = {
      id: 'patient123',
      heartRate: 45, // Critical low
      // Missing name and doctorId
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0].patientName).toBe('Unknown Patient');
    expect(result.alerts[0].doctorId).toBe('unassigned');
  });

  test('generates warning alerts for borderline values', async () => {
    const patientData = {
      id: 'patient123',
      name: 'Borderline Patient',
      doctorId: 'doctor456',
      heartRate: 55, // Warning low
      oxygen: 92, // Warning low
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    expect(result.alerts).toHaveLength(2);
    result.alerts.forEach(alert => {
      expect(alert.severity).toBe('warning');
    });
  });

  test('correctly parses blood pressure and generates appropriate alerts', async () => {
    const patientData = {
      id: 'patient123',
      name: 'Hypertensive Patient',
      doctorId: 'doctor456',
      bloodPressure: '160/100', // High - critical for systolic
    };

    const result = await checkPatientVitals(patientData);

    expect(result.checked).toBe(true);
    // Should generate alerts for systolic BP
    const systolicAlert = result.alerts.find(alert => alert.vitalType === 'bloodPressureSystolic');
    expect(systolicAlert).toBeDefined();
    expect(systolicAlert.currentValue).toBe(160);
    expect(systolicAlert.severity).toBe('critical'); // 160 is above criticalMax of 140
  });

  test('uses a single transaction for multiple alerts in one monitoring cycle', async () => {
    const nowValues = [
      { toDate: () => new Date('2026-04-06T10:00:00Z') },
      { toDate: () => new Date('2026-04-06T10:00:01Z') },
    ];

    Timestamp.now
      .mockReturnValueOnce(nowValues[0])
      .mockReturnValueOnce(nowValues[1]);

    collection.mockImplementation((dbArg, name) => ({ dbArg, name }));
    doc
      .mockImplementationOnce((dbArg, name, id) => ({ path: `${name}/${id}` }))
      .mockImplementationOnce(() => ({ id: 'alert-heart-rate' }))
      .mockImplementationOnce(() => ({ id: 'alert-oxygen' }));

    const transaction = {
      get: jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ lastAlertTimestamps: {} }),
      }),
      set: jest.fn(),
    };

    runTransaction.mockImplementation(async (dbArg, callback) => callback(transaction));

    const patientData = {
      id: 'patient123',
      name: 'Jane Smith',
      doctorId: 'doctor456',
      thresholds: {},
      heartRate: 150,
      oxygen: 85,
    };

    const result = await monitorAndAlert(patientData);

    expect(runTransaction).toHaveBeenCalledTimes(1);
    expect(transaction.get).toHaveBeenCalledTimes(1);
    expect(transaction.set).toHaveBeenCalledTimes(3);
    expect(transaction.set).toHaveBeenLastCalledWith(
      { path: 'patients/patient123' },
      {
        lastAlertTimestamps: {
          heartRate: nowValues[0],
          oxygen: nowValues[1],
        },
      },
      { merge: true }
    );
    expect(result.success).toBe(true);
    expect(result.alertsCreated).toBe(2);
  });
});
