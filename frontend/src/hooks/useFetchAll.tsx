import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth-context';

// OJO que en mi caso el dataField es el nombre de las tablas que están en plural
export function useFetchAll<T>(url: string, dataField: string = 'data', useToken: boolean = false) {
  const { token, refreshToken, loading: authLoading } = useAuth();
  const [data, setData] = useState<{ data: T[] }>({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (useToken && !token) return; // No token available, do not fetch data

    setLoading(true);
    setError(null);

    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (useToken && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { headers });

      if (response.status === 401 && useToken) {
        console.warn("Token expired or missing, trying to refresh...");
        const newToken = await refreshToken();

        if (newToken) {
          const retryHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          };

          const retryResponse = await fetch(url, { headers: retryHeaders });

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          const retryJson = await retryResponse.json();
          setData({ data: retryJson[dataField] ?? [] });
          return;
        }
      }

      if (!response.ok) {
        //si la respuesta es 404 (no hay datos), no lanzamos un error
        if (response.status === 404) {
          setData({ data: [] });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setData({ data: json[dataField] ?? [] });
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Unknown error occurred"));
    } finally {
      setLoading(false);
    }
  }, [url, dataField, useToken, token, refreshToken]);

  useEffect(() => {
    if (!authLoading && (!useToken || token)) {
      fetchData();
    }
  }, [fetchData, authLoading, useToken, token]); // Fetch data when auth loading is done and token is available

  return { data, loading, error, refetch: fetchData };
};