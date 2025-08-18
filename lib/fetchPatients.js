// lib/fetchPatients.js
import { useState, useEffect } from "react";

function FetchPatients() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setLoading(true);
    try {
      const mockPatients = [
        { id: "001", name: "Kumar Pandule", doctor: "Dr Vishal Deshpande", status: "Viral Fever", date: "15-01-2021" },
        { id: "002", name: "Nandita Sharma", doctor: "Dr Hema Pawar", status: "Kidney Heart-Attack", date: "15-01-2021" },
      ];
      setTimeout(() => {
        setPatients(mockPatients);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { loading, error, patients };
}

export default FetchPatients;
