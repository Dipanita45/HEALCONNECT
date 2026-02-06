// React hook for real-time patient vital monitoring and alert generation
import { useEffect, useState, useRef } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { monitorAndAlert } from './alertSystem';

/**
 * Hook to monitor a specific patient's vitals in real-time
 * @param {string} patientId - The patient's ID to monitor
 * @param {boolean} enabled - Whether monitoring is active
 */
export function usePatientMonitor(patientId, enabled = true) {
    const [vitals, setVitals] = useState(null);
    const [monitoring, setMonitoring] = useState(false);
    const lastCheckRef = useRef(null);

    useEffect(() => {
        if (!enabled || !patientId) {
            setMonitoring(false);
            return;
        }

        setMonitoring(true);

        // Listen to the patient's live data
        const patientRef = collection(db, 'patients');
        const q = query(patientRef, where('phoneNumber', '==', patientId));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                console.log(`No patient found with ID: ${patientId}`);
                return;
            }

            const patientDoc = snapshot.docs[0];
            const patientData = { id: patientDoc.id, ...patientDoc.data() };

            setVitals(patientData);

            // Check if vitals have changed since last check
            const currentVitals = JSON.stringify({
                heartRate: patientData.heartRate || patientData.bpm,
                oxygen: patientData.oxygen || patientData.spo2,
                temperature: patientData.temperature || patientData.temp,
                bloodPressure: patientData.bloodPressure
            });

            if (lastCheckRef.current !== currentVitals) {
                lastCheckRef.current = currentVitals;

                // Run alert check
                const result = await monitorAndAlert(patientData);

                if (result.alertsCreated > 0) {
                    console.log(`🚨 ${result.alertsCreated} alert(s) created for ${patientData.name}`);
                }
            }
        }, (error) => {
            console.error('Error monitoring patient:', error);
            setMonitoring(false);
        });

        return () => {
            unsubscribe();
            setMonitoring(false);
        };
    }, [patientId, enabled]);

    return { vitals, monitoring };
}

/**
 * Hook to monitor multiple patients at once
 * @param {string} doctorId - The doctor's ID
 * @param {boolean} enabled - Whether monitoring is active
 */
export function useMultiPatientMonitor(doctorId, enabled = true) {
    const [patients, setPatients] = useState([]);
    const [monitoring, setMonitoring] = useState(false);
    const lastChecksRef = useRef({});

    useEffect(() => {
        if (!enabled || !doctorId) {
            setMonitoring(false);
            return;
        }

        setMonitoring(true);

        // Listen to all patients assigned to this doctor
        const patientsRef = collection(db, 'patients');
        const q = query(patientsRef, where('doctorId', '==', doctorId));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const patientsList = [];

            for (const doc of snapshot.docs) {
                const patientData = { id: doc.id, ...doc.data() };
                patientsList.push(patientData);

                // Check each patient's vitals
                const patientId = patientData.id;
                const currentVitals = JSON.stringify({
                    heartRate: patientData.heartRate || patientData.bpm,
                    oxygen: patientData.oxygen || patientData.spo2,
                    temperature: patientData.temperature || patientData.temp,
                    bloodPressure: patientData.bloodPressure
                });

                // Only check if vitals have changed
                if (lastChecksRef.current[patientId] !== currentVitals) {
                    lastChecksRef.current[patientId] = currentVitals;

                    const result = await monitorAndAlert(patientData);

                    if (result.alertsCreated > 0) {
                        console.log(`🚨 ${result.alertsCreated} alert(s) for ${patientData.name}`);
                    }
                }
            }

            setPatients(patientsList);
        }, (error) => {
            console.error('Error monitoring patients:', error);
            setMonitoring(false);
        });

        return () => {
            unsubscribe();
            setMonitoring(false);
        };
    }, [doctorId, enabled]);

    return { patients, monitoring, count: patients.length };
}

/**
 * Hook to listen for real-time alerts for a doctor
 * @param {string} doctorId - The doctor's ID
 * @param {boolean} onlyUnacknowledged - Only show unacknowledged alerts
 */
export function useAlertListener(doctorId, onlyUnacknowledged = true) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAlertCount, setNewAlertCount] = useState(0);
    const previousCountRef = useRef(0);

    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        const alertsRef = collection(db, 'alerts');
        let q = query(
            alertsRef,
            where('doctorId', '==', doctorId)
        );

        if (onlyUnacknowledged) {
            q = query(q, where('acknowledged', '==', false));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertsList = [];

            snapshot.forEach(doc => {
                alertsList.push({ id: doc.id, ...doc.data() });
            });

            // Sort by creation time, newest first
            alertsList.sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA;
            });

            setAlerts(alertsList);

            // Detect new alerts
            if (alertsList.length > previousCountRef.current) {
                const newCount = alertsList.length - previousCountRef.current;
                setNewAlertCount(newCount);

                // Play a sound or show notification here if needed
                if (newCount > 0) {
                    console.log(`🔔 ${newCount} new alert(s) received`);
                }
            }

            previousCountRef.current = alertsList.length;
            setLoading(false);
        }, (error) => {
            console.error('Error listening to alerts:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [doctorId, onlyUnacknowledged]);

    // Function to clear the new alert count
    const clearNewAlertCount = () => setNewAlertCount(0);

    return {
        alerts,
        loading,
        count: alerts.length,
        newAlertCount,
        clearNewAlertCount
    };
}
