// lib/fetchPatients.js
import { useState, useEffect } from "react";
import patientService from "./services/patientService";

/**
 * Custom Hook to fetch patients assigned to the current doctor.
 * Uses patientService to call the /api/patients backend endpoint.
 */
function useFetchPatients() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    async function getPatients() {
      setLoading(true);
      try {
        const response = await patientService.getAll();
        if (response.success) {
          setPatients(response.data || []);
        } else {
          setError(response.message || "Failed to fetch patients.");
        }
      } catch (err) {
        console.error("Error in useFetchPatients:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    getPatients();
  }, []);

  return { loading, error, patients };
}

export default useFetchPatients;
