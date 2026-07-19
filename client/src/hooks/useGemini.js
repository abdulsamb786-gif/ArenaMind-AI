import { useState, useCallback } from 'react';
import { api } from '../services/api';

export default function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runPipeline = useCallback(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.incident.report(input);
      return result;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMission = useCallback(async (alert) => {
    setLoading(true);
    setError(null);
    try {
      return await api.stadium.mission(alert);
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, runPipeline, generateMission };
}
