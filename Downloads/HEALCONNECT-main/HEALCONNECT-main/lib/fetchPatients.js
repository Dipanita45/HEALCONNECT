import {useState, useEffect} from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

function FetchPatients() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [patients, setPatients] = useState([])

    useEffect(() => {
      setLoading(true)
      const collectionRef = collection(db, 'patients')
      onSnapshot(collectionRef, (snapshot) => {
        let patients = []
        snapshot.docs.map((doc) => {
         patients.push({ ...doc.data(), id: doc.id, })
        })
        setPatients(patients)
        setLoading(false)
      })
    }, [])


  return {loading, error, patients}
}

export default FetchPatients