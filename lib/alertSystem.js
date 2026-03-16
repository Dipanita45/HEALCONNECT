// Alert system for monitoring patient vitals and generating emergency notifications
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { isVitalNormal, parseBloodPressure, DEFAULT_THRESHOLDS } from './thresholdDefaults';
import logger from './logger';

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

        logger.debug(`Alert saved for ${alertData.patientName}: ${alertData.vitalName} is ${alertData.direction}`);

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

    // Create alerts using a transaction to prevent race conditions bypassing rate limits
    for (const alert of alerts) {
        try {
            const patientRef = doc(db, 'patients', alert.patientId);
            const alertsColRef = collection(db, 'alerts');
            const newAlertRef = doc(alertsColRef);

            await runTransaction(db, async (transaction) => {
                const patientDoc = await transaction.get(patientRef);
                
                let lastAlertTimestamps = {};
                if (patientDoc.exists() && patientDoc.data().lastAlertTimestamps) {
                    lastAlertTimestamps = patientDoc.data().lastAlertTimestamps;
                }

                const vitalType = alert.vitalType;
                const now = Timestamp.now();
                const minutesAgo = 15;
                const cutoffTime = new Date();
                cutoffTime.setMinutes(cutoffTime.getMinutes() - minutesAgo);
                
                // Verify 15-minute gap
                if (lastAlertTimestamps[vitalType]) {
                    const lastAlertTime = lastAlertTimestamps[vitalType].toDate();
                    if (lastAlertTime > cutoffTime) {
                        logger.debug(`Skipping duplicate alert (transaction lock) for ${patientName}: ${alert.vitalName}`);
                        return; // Exit transaction early, bypassing write
                    }
                }

                // Prepare alert document
                const alertDocData = {
                    ...alert,
                    acknowledged: false,
                    acknowledgedAt: null,
                    acknowledgedBy: null,
                    createdAt: now,
                    createdAtReadable: new Date().toLocaleString(),
                    isGlobal: alert.isGlobal || false
                };
                
                // Write the alert
                transaction.set(newAlertRef, alertDocData);

                // Update the generic patient document with the new concurrency lock timestamp
                lastAlertTimestamps[vitalType] = now;
                
                transaction.set(patientRef, {
                    lastAlertTimestamps: lastAlertTimestamps
                }, { merge: true });

                createdAlerts.push({ id: newAlertRef.id, ...alertDocData });
            });
        } catch (error) {
            console.error('Transaction failed for alert generation:', error);
            logger.error(`Transaction failed for ${patientName} (${alert.vitalName}): ${error.message}`);
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

        logger.debug(`Alert ${alertId} acknowledged by ${doctorName}`);
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
