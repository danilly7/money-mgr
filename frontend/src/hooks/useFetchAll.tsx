import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '../firebase/auth';

// OJO que en mi caso el dataField es el nombre de las tablas que están en plural
export function useFetchAll<T>(url: string, dataField: string = 'data', useToken: boolean = false) {
    const [data, setData] = useState<{ data: T[] }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
    
        const token = useToken ? await getAuthToken() : null;
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    
        try {
            const response = await fetch(url, { headers });
    
            if (response.status === 401 && useToken) {
                console.warn("Token expirado, intentando renovarlo...");
                const newToken = await getAuthToken(); //intenta renovar el token, éstos caducan a la hora.
    
                if (newToken) {
                    const retryHeaders: HeadersInit = { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${newToken}` //usa el nuevo token
                    };
    
                    const retryResponse = await fetch(url, { headers: retryHeaders });
    
                    if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
                    const retryJson = await retryResponse.json();
                    setData({ data: retryJson[dataField] ?? [] });
                    return;
                }
            }
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const json = await response.json();
            setData({ data: json[dataField] ?? [] });
    
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [url, dataField, useToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};