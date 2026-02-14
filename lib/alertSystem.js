// Alert system for monitoring patient vitals and generating emergency notifications
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { isVitalNormal, parseBloodPressure, DEFAULT_THRESHOLDS } from './thresholdDefaults';

// Check all vitals for a patient and generate alerts if needed
export async function checkPatientVitals(patientData) {
    if (!patientData) return { alerts: [], checked: false };

    const alerts = [];
    const patientId = patientData.id || patientData.uid || patientData.phoneNumber;
    const patientName = patientData.name || 'Unknown Patient';
    // 🚨 Critical Safety Fix: Handle unassigned patients
    const doctorId = patientData.doctorId || patientData.assignedDoctor || 'unassigned';
    const isGlobal = doctorId === 'unassigned';

    // Check heart rate
    if (patientData.heartRate || patientData.bpm) {
        const heartRate = parseFloat(patientData.heartRate || patientData.bpm);
        const result = isVitalNormal('heartRate', heartRate);

        if (result.severity === 'warning' || result.severity === 'critical') {
            alerts.push({
                patientId,
                patientName,
                doctorId,
                vitalType: 'heartRate',
                vitalName: 'Heart Rate',
                currentValue: heartRate,
                unit: 'bpm',
                severity: result.severity,
                message: result.message,
                direction: result.direction,
                isGlobal
            });
        }
    }

    // Check oxygen saturation
    if (patientData.oxygen || patientData.spo2) {
        const oxygen = parseFloat(patientData.oxygen || patientData.spo2);
        const result = isVitalNormal('oxygen', oxygen);

        if (result.severity === 'warning' || result.severity === 'critical') {
            alerts.push({
                patientId,
                patientName,
                doctorId,
                vitalType: 'oxygen',
                vitalName: 'Oxygen Saturation',
                currentValue: oxygen,
                unit: '%',
                severity: result.severity,
                message: result.message,
                direction: result.direction,
                isGlobal
            });
        }
    }

    // Check temperature
    if (patientData.temperature || patientData.temp) {
        const temperature = parseFloat(patientData.temperature || patientData.temp);
        const result = isVitalNormal('temperature', temperature);

        if (result.severity === 'warning' || result.severity === 'critical') {
            alerts.push({
                patientId,
                patientName,
                doctorId,
                vitalType: 'temperature',
                vitalName: 'Body Temperature',
                currentValue: temperature,
                unit: '°C',
                severity: result.severity,
                message: result.message,
                direction: result.direction,
                isGlobal
            });
        }
    }

    // Check blood pressure
    if (patientData.bloodPressure) {
        const bp = parseBloodPressure(patientData.bloodPressure);

        if (bp) {
            // Check systolic
            const systolicResult = isVitalNormal('bloodPressureSystolic', bp.systolic);
            if (systolicResult.severity === 'warning' || systolicResult.severity === 'critical') {
                alerts.push({
                    patientId,
                    patientName,
                    doctorId,
                    vitalType: 'bloodPressureSystolic',
                    vitalName: 'Systolic BP',
                    currentValue: bp.systolic,
                    unit: 'mmHg',
                    severity: systolicResult.severity,
                    message: systolicResult.message,
                    direction: systolicResult.direction,
                    isGlobal
                });
            }

            // Check diastolic
            const diastolicResult = isVitalNormal('bloodPressureDiastolic', bp.diastolic);
            if (diastolicResult.severity === 'warning' || diastolicResult.severity === 'critical') {
                alerts.push({
                    patientId,
                    patientName,
                    doctorId,
                    vitalType: 'bloodPressureDiastolic',
                    vitalName: 'Diastolic BP',
                    currentValue: bp.diastolic,
                    unit: 'mmHg',
                    severity: diastolicResult.severity,
                    message: diastolicResult.message,
                    direction: diastolicResult.direction,
                    isGlobal
                });
            }
        }
    }

    return { alerts, checked: true, patientId, patientName };
}

// Save an alert to Firestore
export async function saveAlert(alertData) {
    try {
        const alertDoc = {
            ...alertData,
            acknowledged: false,
            acknowledgedAt: null,
            acknowledgedBy: null,
            createdAt: Timestamp.now(),
            // Add a readable timestamp for easier debugging
            createdAtReadable: new Date().toLocaleString(),
            isGlobal: alertData.isGlobal || false
        };

        const docRef = await addDoc(collection(db, 'alerts'), alertDoc);

        console.log(`✅ Alert saved for ${alertData.patientName}: ${alertData.vitalName} is ${alertData.direction}`);

        return { success: true, alertId: docRef.id, alert: alertDoc };
    } catch (error) {
        console.error('Error saving alert:', error);
        return { success: false, error: error.message };
    }
}

// Check if a similar alert was recently created (to avoid spam)
export async function hasRecentAlert(patientId, vitalType, minutesAgo = 15) {
    try {
        const cutoffTime = new Date();
        cutoffTime.setMinutes(cutoffTime.getMinutes() - minutesAgo);

        const q = query(
            collection(db, 'alerts'),
            where('patientId', '==', patientId),
            where('vitalType', '==', vitalType),
            where('createdAt', '>', Timestamp.fromDate(cutoffTime)),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error('Error checking recent alerts:', error);
        // If there's an error, assume no recent alert to be safe
        return false;
    }
}

// Main function to check vitals and create alerts
export async function monitorAndAlert(patientData) {
    const { alerts, checked, patientId, patientName } = await checkPatientVitals(patientData);

    if (!checked) {
        return { success: false, message: 'Unable to check vitals' };
    }

    if (alerts.length === 0) {
        return { success: true, message: 'All vitals normal', alertsCreated: 0 };
    }

    const createdAlerts = [];

    // Create alerts, but check for recent duplicates first
    for (const alert of alerts) {
        const hasRecent = await hasRecentAlert(alert.patientId, alert.vitalType);

        if (!hasRecent) {
            const result = await saveAlert(alert);
            if (result.success) {
                createdAlerts.push(result.alert);
            }
        } else {
            console.log(`⏭️ Skipping duplicate alert for ${patientName}: ${alert.vitalName}`);
        }
    }

    return {
        success: true,
        message: `Created ${createdAlerts.length} alerts`,
        alertsCreated: createdAlerts.length,
        alerts: createdAlerts
    };
}

// Acknowledge an alert
export async function acknowledgeAlert(alertId, doctorId, doctorName) {
    try {
        const { doc, updateDoc } = await import('firebase/firestore');

        const alertRef = doc(db, 'alerts', alertId);
        await updateDoc(alertRef, {
            acknowledged: true,
            acknowledgedAt: Timestamp.now(),
            acknowledgedBy: doctorId,
            acknowledgedByName: doctorName
        });

        console.log(`✅ Alert ${alertId} acknowledged by ${doctorName}`);
        return { success: true };
    } catch (error) {
        console.error('Error acknowledging alert:', error);
        return { success: false, error: error.message };
    }
}

// Get active alerts for a doctor
export async function getActiveAlerts(doctorId) {
    try {
        const q = query(
            collection(db, 'alerts'),
            where('doctorId', '==', doctorId),
            where('acknowledged', '==', false),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const alerts = [];

        snapshot.forEach(doc => {
            alerts.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, alerts };
    } catch (error) {
        console.error('Error fetching active alerts:', error);
        return { success: false, error: error.message, alerts: [] };
    }
}
