import { useState, useEffect } from 'react';
import { getAuthToken } from '../firebase/auth';

export function useFetchByPage<T>(url: string, page: number, useToken: boolean = false) {
    const [data, setData] = useState<{ data: T[]; next?: string | null }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const headers: HeadersInit = { 'Content-Type': 'application/json' };

                //si useToken es true, obtiene el token y lo agrega a las cabeceras
                if (useToken) {
                    const token = await getAuthToken();
                    
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }

                const response = await fetch(`${url}?page=${page ?? 1}`, { headers });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                //hay más páginas? sabremos dependiendo del campo 'next' o 'currentPage'
                setHasMore(json.currentPage < json.totalPages || !!json.next);

                //actualizamos los datos, agregando los previos y los nuevos
                setData((prevData) => ({
                    data: [...(prevData?.data || []), ...(Array.isArray(json.data) ? json.data : [])],
                    next: json.next || null
                }));
            } catch (error) {
                if (error instanceof Error) {
                    setError(error);
                } else {
                    setError(new Error("Unknown error occurred"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, page, useToken]);

    return { data, loading, error, hasMore };
};