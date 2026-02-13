// Custom React Hook for API calls
import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFunction, immediate = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...params);
      
      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.error || 'An error occurred');
        return result;
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute };
}

export function usePatients(filters = {}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/patients?${new URLSearchParams(filters)}`);
        const result = await response.json();
        
        if (result.success) {
          setPatients(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [JSON.stringify(filters)]);

  return { patients, loading, error };
}

export function useVitals(patientId, options = {}) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchVitals = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          patientId,
          ...options
        });
        
        const response = await fetch(`/api/vitals?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setVitals(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [patientId, JSON.stringify(options)]);

  return { vitals, loading, error };
}

export function useAlerts(filters = {}) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/alerts?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setAlerts(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [JSON.stringify(filters)]);

  const acknowledgeAlert = async (alertId, acknowledgedBy) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true, acknowledgedBy }
            : alert
        ));
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { alerts, loading, error, acknowledgeAlert };
}

export function useRealtimeVitals(patientId) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    // Import dynamically to avoid SSR issues
    import('../services/vitalService').then(({ vitalService }) => {
      const unsubscribe = vitalService.subscribeToVitals(
        patientId,
        (newVitals) => {
          setVitals(newVitals);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });
  }, [patientId]);

  return { vitals, loading };
}

export function useRealtimeAlerts(filters = {}) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import dynamically to avoid SSR issues
    import('../services/alertService').then(({ alertService }) => {
      const unsubscribe = alertService.subscribeToAlerts(
        filters,
        (newAlerts) => {
          setAlerts(newAlerts);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });
  }, [JSON.stringify(filters)]);

  return { alerts, loading };
}
