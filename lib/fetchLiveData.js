import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Custom Hook to fetch real-time data for a specific device.
 * @param {string} deviceId - The ID of the device to listen to.
 * This hook replaces the hardcoded "0001" device ID logic.
 */
export default function useFetchLiveData(deviceId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setData] = useState();

  useEffect(() => {
    // Basic validation to prevent starting listener on undefined/null ID
    if (!deviceId) {
      setLoading(false);
      return;
    }

    const documentRef = doc(db, "devices", deviceId);

    // Listen for changes to specific fields in real-time
    const unsubscribe = onSnapshot(documentRef, { includeMetadataChanges: true }, (docSnapshot) => {
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
        setLoading(false);
      } else {
        setError(`Device ${deviceId} not found!`);
        setLoading(false);
      }
    }, (err) => {
      console.error(`Error in useFetchLiveData for ${deviceId}:`, err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deviceId]);

  return { liveData, loading, error };
}
