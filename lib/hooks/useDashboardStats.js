import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

/**
 * Custom hook to fetch and keep track of doctor's dashboard statistics.
 * These stats include: Total Patients, Total Reports, and Scheduled Appointments.
 */
function useDashboardStats() {
  const [stats, setStats] = useState({
    patients: 0,
    reports: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const response = await apiClient.get('/doctor/stats');
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || "Failed to fetch stats.");
        }
      } catch (err) {
        console.error("Error in useDashboardStats:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export default useDashboardStats;
