import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth-context';

export function useFetchByPage<T>(url: string, page: number, useToken: boolean = false, dataKey: string) {
    const { token, loading: authLoading, refreshToken } = useAuth();
    const [data, setData] = useState<{ data: T[]; next?: string | null }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        if (authLoading) return;

        setLoading(true);
        try {
            const headers: HeadersInit = { 'Content-Type': 'application/json' };

            if (useToken && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${url}?page=${page ?? 1}`, { headers });

            if (response.status === 401 && useToken) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(`${url}?page=${page ?? 1}`, { headers: retryHeaders });

                    if (!retryResponse.ok) {
                        throw new Error(`HTTP error! status: ${retryResponse.status}`);
                    }

                    const retryJson = await retryResponse.json();
                    const dataFromResponse = retryJson[dataKey] || [];
                    setHasMore(retryJson.currentPage < retryJson.totalPages || !!retryJson.next);

                    if (page === 1) {
                        setData({
                            data: [...(Array.isArray(dataFromResponse) ? dataFromResponse : [])],
                            next: retryJson.next || null,
                        });
                    } else {
                        setData((prevData) => ({
                            data: [...prevData.data, ...(Array.isArray(dataFromResponse) ? dataFromResponse : [])],
                            next: retryJson.next || null,
                        }));
                    }

                    return;
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            const dataFromResponse = json[dataKey] || [];
            setHasMore(json.currentPage < json.totalPages || !!json.next);

            if (page === 1) {
                setData({
                    data: [...(Array.isArray(dataFromResponse) ? dataFromResponse : [])],
                    next: json.next || null,
                });
            } else {
                setData((prevData) => ({
                    data: [...prevData.data, ...(Array.isArray(dataFromResponse) ? dataFromResponse : [])],
                    next: json.next || null,
                }));
            }
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [url, page, useToken, dataKey, token, authLoading, refreshToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, hasMore, refetch };
};