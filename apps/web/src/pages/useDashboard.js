import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

export function useDashboard(path) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await apiRequest(path);
      setDashboard(payload.dashboard);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { load(); }, [load]);
  return { dashboard, loading, error, reload: load };
}
