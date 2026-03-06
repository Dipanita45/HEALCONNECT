// Default medical thresholds for patient vitals
// These values are based on standard clinical guidelines

export const DEFAULT_THRESHOLDS = {
  heartRate: {
    vitalType: 'heartRate',
    minValue: 60,
    maxValue: 100,
    unit: 'bpm',
    warningMin: 55,
    warningMax: 105,
    criticalMin: 40,
    criticalMax: 120,
    description: 'Normal resting heart rate for adults'
  },
  oxygen: {
    vitalType: 'oxygen',
    minValue: 95,
    maxValue: 100,
    unit: '%',
    warningMin: 92,
    warningMax: 100,
    criticalMin: 88,
    criticalMax: 100,
    description: 'Blood oxygen saturation level'
  },
  temperature: {
    vitalType: 'temperature',
    minValue: 36.1,
    maxValue: 37.2,
    unit: '°C',
    warningMin: 35.5,
    warningMax: 37.8,
    criticalMin: 35.0,
    criticalMax: 39.0,
    description: 'Normal body temperature range'
  },
  bloodPressureSystolic: {
    vitalType: 'bloodPressureSystolic',
    minValue: 90,
    maxValue: 120,
    unit: 'mmHg',
    warningMin: 85,
    warningMax: 130,
    criticalMin: 70,
    criticalMax: 140,
    description: 'Systolic blood pressure (top number)'
  },
  bloodPressureDiastolic: {
    vitalType: 'bloodPressureDiastolic',
    minValue: 60,
    maxValue: 80,
    unit: 'mmHg',
    warningMin: 55,
    warningMax: 85,
    criticalMin: 40,
    criticalMax: 90,
    description: 'Diastolic blood pressure (bottom number)'
  }
};

// Helper function to check if a vital is within normal range
export function isVitalNormal(vitalType, value) {
  const threshold = DEFAULT_THRESHOLDS[vitalType];
  if (!threshold) return { status: 'unknown', message: 'Unknown vital type' };

  if (value >= threshold.minValue && value <= threshold.maxValue) {
    return { status: 'normal', severity: 'none', message: 'Within normal range' };
  }

  // Check if it's in warning range
  if (value >= threshold.warningMin && value <= threshold.warningMax) {
    const direction = value < threshold.minValue ? 'low' : 'high';
    return {
      status: 'warning',
      severity: 'warning',
      message: `Slightly ${direction} - monitor closely`,
      direction
    };
  }

  // Must be critical
  const direction = value < threshold.criticalMin ? 'low' : 'high';
  return {
    status: 'critical',
    severity: 'critical',
    message: `Critically ${direction} - immediate attention needed`,
    direction
  };
}

// Parse blood pressure string (e.g., "120/80") into systolic and diastolic
export function parseBloodPressure(bpString) {
  if (!bpString || typeof bpString !== 'string') return null;

  const parts = bpString.split('/');
  if (parts.length !== 2) return null;

  const systolic = parseInt(parts[0]);
  const diastolic = parseInt(parts[1]);

  if (isNaN(systolic) || isNaN(diastolic)) return null;

  return { systolic, diastolic };
}

// Get a user-friendly message for vital status
export function getVitalStatusMessage(vitalType, value) {
  const result = isVitalNormal(vitalType, value);
  const threshold = DEFAULT_THRESHOLDS[vitalType];

  if (!threshold) return 'Unable to assess vital';

  const vitalName = vitalType.replace(/([A-Z])/g, ' $1').trim();

  switch (result.status) {
    case 'normal':
      return `${vitalName} is normal at ${value}${threshold.unit}`;
    case 'warning':
      return `${vitalName} is ${result.direction} at ${value}${threshold.unit} - please monitor`;
    case 'critical':
      return `⚠️ ${vitalName} is critically ${result.direction} at ${value}${threshold.unit}!`;
    default:
      return `${vitalName}: ${value}${threshold.unit}`;
  }
}

// Initialize default thresholds in Firestore (call this once during setup)
export async function initializeDefaultThresholds(db) {
  const { collection, doc, setDoc, getDoc } = await import('firebase/firestore');

  try {
    // Check if thresholds already exist
    const thresholdsRef = doc(db, 'systemConfig', 'thresholds');
    const thresholdsSnap = await getDoc(thresholdsRef);

    if (thresholdsSnap.exists()) {
      console.log('Thresholds already initialized');
      return { success: true, message: 'Thresholds already exist' };
    }

    // Create the thresholds document
    await setDoc(thresholdsRef, {
      ...DEFAULT_THRESHOLDS,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0'
    });

    console.log('✅ Default thresholds initialized successfully');
    return { success: true, message: 'Thresholds initialized' };
  } catch (error) {
    console.error('Error initializing thresholds:', error);
    return { success: false, error: error.message };
  }
}
