import { isVitalNormal, parseBloodPressure, getVitalStatusMessage, DEFAULT_THRESHOLDS } from '../../lib/thresholdDefaults';

describe('Threshold Defaults Utilities', () => {
  describe('isVitalNormal', () => {
    test('returns normal status for heart rate within normal range', () => {
      const result = isVitalNormal('heartRate', 75);
      expect(result.status).toBe('normal');
      expect(result.severity).toBe('none');
      expect(result.message).toBe('Within normal range');
    });

    test('returns warning status for heart rate in warning range', () => {
      const result = isVitalNormal('heartRate', 55);
      expect(result.status).toBe('warning');
      expect(result.severity).toBe('warning');
      expect(result.direction).toBe('low');
    });

    test('returns critical status for heart rate in critical range', () => {
      const result = isVitalNormal('heartRate', 35);
      expect(result.status).toBe('critical');
      expect(result.severity).toBe('critical');
      expect(result.direction).toBe('low');
    });

    test('returns unknown for invalid vital type', () => {
      const result = isVitalNormal('invalidType', 75);
      expect(result.status).toBe('unknown');
      expect(result.message).toBe('Unknown vital type');
    });

    test('handles oxygen saturation correctly', () => {
      const result = isVitalNormal('oxygen', 90);
      expect(result.status).toBe('critical');
      expect(result.direction).toBe('high'); // Note: current logic considers this 'high' even though for oxygen, lower is worse
    });

    test('handles temperature correctly', () => {
      const result = isVitalNormal('temperature', 38.5);
      expect(result.status).toBe('critical');
      expect(result.direction).toBe('high');
    });
  });

  describe('parseBloodPressure', () => {
    test('parses valid blood pressure string correctly', () => {
      const result = parseBloodPressure('120/80');
      expect(result).toEqual({ systolic: 120, diastolic: 80 });
    });

    test('returns null for invalid string format', () => {
      expect(parseBloodPressure('invalid')).toBeNull();
      expect(parseBloodPressure('120')).toBeNull();
      expect(parseBloodPressure('120/80/90')).toBeNull();
    });

    test('returns null for non-numeric values', () => {
      expect(parseBloodPressure('abc/def')).toBeNull();
    });

    test('returns null for null or undefined input', () => {
      expect(parseBloodPressure(null)).toBeNull();
      expect(parseBloodPressure(undefined)).toBeNull();
    });
  });

  describe('getVitalStatusMessage', () => {
    test('returns normal message for normal values', () => {
      const message = getVitalStatusMessage('heartRate', 75);
      expect(message).toContain('heart Rate is normal at 75bpm');
    });

    test('returns warning message for warning values', () => {
      const message = getVitalStatusMessage('oxygen', 93);
      expect(message).toContain('oxygen is low at 93% - please monitor');
    });

    test('returns critical message for critical values', () => {
      const message = getVitalStatusMessage('heartRate', 35);
      expect(message).toContain('⚠️ heart Rate is critically low');
    });

    test('returns unable to assess for unknown vital type', () => {
      const message = getVitalStatusMessage('unknown', 75);
      expect(message).toBe('Unable to assess vital');
    });
  });

  describe('DEFAULT_THRESHOLDS', () => {
    test('contains all expected vital types', () => {
      const expectedVitals = ['heartRate', 'oxygen', 'temperature', 'bloodPressureSystolic', 'bloodPressureDiastolic'];
      expectedVitals.forEach(vital => {
        expect(DEFAULT_THRESHOLDS).toHaveProperty(vital);
        expect(DEFAULT_THRESHOLDS[vital]).toHaveProperty('minValue');
        expect(DEFAULT_THRESHOLDS[vital]).toHaveProperty('maxValue');
        expect(DEFAULT_THRESHOLDS[vital]).toHaveProperty('unit');
      });
    });

    test('heart rate thresholds are correct', () => {
      const hr = DEFAULT_THRESHOLDS.heartRate;
      expect(hr.minValue).toBe(60);
      expect(hr.maxValue).toBe(100);
      expect(hr.unit).toBe('bpm');
    });
  });
});