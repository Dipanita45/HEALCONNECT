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

    const thresholds = patientData.thresholds || null;

    // Check heart rate
    if (patientData.heartRate || patientData.bpm) {
        const heartRate = parseFloat(patientData.heartRate || patientData.bpm);
        const result = isVitalNormal('heartRate', heartRate, thresholds);

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
        const result = isVitalNormal('oxygen', oxygen, thresholds);

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
        const result = isVitalNormal('temperature', temperature, thresholds);

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
            const systolicResult = isVitalNormal('bloodPressureSystolic', bp.systolic, thresholds);
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
            const diastolicResult = isVitalNormal('bloodPressureDiastolic', bp.diastolic, thresholds);
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
export async function monitorAndAlert(patientIdOrData, specificVitals = null) {
    let patientData = null;
    let patientId = typeof patientIdOrData === 'string' ? patientIdOrData : (patientIdOrData.id || patientIdOrData.uid || patientIdOrData.phoneNumber);

    try {
        if (typeof patientIdOrData === 'string' || !patientIdOrData.thresholds) {
            // Need to fetch full patient data for thresholds
            const patientSnap = await getDocs(query(collection(db, 'patients'), where('phoneNumber', '==', patientId)));
            if (!patientSnap.empty) {
                const doc = patientSnap.docs[0];
                patientData = { id: doc.id, ...doc.data() };
            } else {
                // Try fetching by ID
                const docSnap = await getDocs(query(collection(db, 'patients'), where('uid', '==', patientId)));
                if (!docSnap.empty) {
                    const doc = docSnap.docs[0];
                    patientData = { id: doc.id, ...doc.data() };
                }
            }
        } else {
            patientData = patientIdOrData;
        }

        // If we have specific vital data from the API, merge it into patientData for checking
        if (specificVitals) {
            patientData = { ...patientData, ...specificVitals };
        }

        if (!patientData) {
            logger.error(`Unable to find patient ${patientId} for alert monitoring`);
            return { success: false, message: 'Patient not found' };
        }

        const { alerts, checked, patientName } = await checkPatientVitals(patientData);

        if (!checked) {
            return { success: false, message: 'Unable to check vitals' };
        }

        if (alerts.length === 0) {
            return { success: true, message: 'All vitals normal', alertsCreated: 0 };
        }

        const patientRef = doc(db, 'patients', patientData.id);
        const alertsColRef = collection(db, 'alerts');
        const createdAlerts = [];

        try {
            const committedAlerts = await runTransaction(db, async (transaction) => {
                const latestPatientDoc = await transaction.get(patientRef);
                const existingLastAlertTimestamps =
                    latestPatientDoc.exists() && latestPatientDoc.data().lastAlertTimestamps
                        ? latestPatientDoc.data().lastAlertTimestamps
                        : {};

                const lastAlertTimestamps = { ...existingLastAlertTimestamps };
                const pendingAlerts = [];
                const minutesAgo = 15;
                const cutoffTime = new Date();
                cutoffTime.setMinutes(cutoffTime.getMinutes() - minutesAgo);

                for (const alert of alerts) {
                    const vitalType = alert.vitalType;
                    const lastAlertTimestamp = lastAlertTimestamps[vitalType];

                    // Verify 15-minute gap against the latest committed state in this transaction.
                    if (lastAlertTimestamp) {
                        const lastAlertTime = lastAlertTimestamp.toDate();
                        if (lastAlertTime > cutoffTime) {
                            logger.debug(`Skipping duplicate alert for ${patientName}: ${alert.vitalName}`);
                            continue;
                        }
                    }

                    const now = Timestamp.now();
                    const newAlertRef = doc(alertsColRef);
                    const alertDocData = {
                        ...alert,
                        acknowledged: false,
                        acknowledgedAt: null,
                        acknowledgedBy: null,
                        createdAt: now,
                        createdAtReadable: new Date().toLocaleString(),
                        isGlobal: alert.isGlobal || false
                    };

                    transaction.set(newAlertRef, alertDocData);
                    lastAlertTimestamps[vitalType] = now;
                    pendingAlerts.push({ id: newAlertRef.id, ...alertDocData });
                }

                if (pendingAlerts.length > 0) {
                    transaction.set(patientRef, {
                        lastAlertTimestamps
                    }, { merge: true });
                }

                return pendingAlerts;
            });

            createdAlerts.push(...committedAlerts);
        } catch (error) {
            console.error('Transaction failed for alert generation:', error);
            logger.error(`Transaction failed for ${patientName}: ${error.message}`);
        }

        return {
            success: true,
            message: `Created ${createdAlerts.length} alerts`,
            alertsCreated: createdAlerts.length,
            alerts: createdAlerts
        };
    } catch (error) {
        console.error('Error in monitorAndAlert:', error);
        return { success: false, error: error.message };
    }
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
