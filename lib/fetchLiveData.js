import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { monitorAndAlert } from './alertSystem';

export default function FetchLiveData(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setData] = useState();

  useEffect(() => {
    const documentRef = doc(db, "devices", "0001");

    // Listen for changes to specific fields in real-time
    const unsubscribe = onSnapshot(documentRef, { includeMetadataChanges: true }, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Get the data from the fields
        const pulse = docSnapshot.get('Pulse');
        const temp = docSnapshot.get('Temprature');
        const spo2 = docSnapshot.get('SpO2');

        // Create a new data model array with the updated field data
        const newData = [{
          Pulse: pulse,
          Temprature: temp,
          SpO2: spo2
        }];

        // Update the state with the new data
        setData(newData);

        // Check vitals and generate alerts if needed
        // Note: You'll need to add patient info (id, name, doctorId) to the device document
        const patientData = {
          id: docSnapshot.get('patientId') || '0001',
          name: docSnapshot.get('patientName') || 'Test Patient',
          doctorId: docSnapshot.get('doctorId'),
          heartRate: pulse,
          temperature: temp,
          oxygen: spo2
        };

        // Only monitor if we have a doctor assigned
        if (patientData.doctorId) {
          await monitorAndAlert(patientData);
        }
      } else {
        setError('Device not found!');
      }
    });

    return () => unsubscribe();
  }, []);

  return { liveData, loading, error };
}
