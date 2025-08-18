import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { data } from 'autoprefixer';

export default function FetchLiveData(props) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [liveData, setData] = useState()

    useEffect(() => {
        const documentRef = doc(db, "devices", "0001");
        // Listen for changes to specific fields in real-time
        const unsubscribe = onSnapshot(documentRef, { includeMetadataChanges: true }, (docSnapshot) => {
          if (docSnapshot.exists()) {
            // Get the data from the fields
            const pulse = docSnapshot.get('Pulse');
            const temp = docSnapshot.get('Temprature');
            
            // Create a new data model array with the updated field data
            const newData = [{ Pulse: pulse, Temprature: temp }];
            
            // Update the state with the new data
            setData(newData);
          }else{
            setError('Device not found!')
          }
        });
    
        return () => unsubscribe();
      }, []);
    return{liveData, loading, error};
}

