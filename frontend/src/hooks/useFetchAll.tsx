import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '../firebase/auth';

//OJO que en mi caso el dataField es el nombre de las tablas que están en plural
export function useFetchAll<T>(url: string, dataField: string = 'data', useToken: boolean = false) {
    const [data, setData] = useState<{ data: T[] }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
            try {
                const headers: HeadersInit = { 'Content-Type': 'application/json' };

                //si useToken es true, obtiene el token y lo agrega a las cabeceras
                if (useToken) {
                    const token = await getAuthToken();
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }

                const response = await fetch(url, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                //manejamos la respuesta dependiendo del campo dataField
                if (json[dataField] && Array.isArray(json[dataField])) {
                    setData({ data: json[dataField] });
                } else {
                    setData({ data: [] });
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error);
                } else {
                    setError(new Error("Unknown error occurred"));
                }
            } finally {
                setLoading(false);
            }
        }, [url, dataField, useToken]);
        
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};