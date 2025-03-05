import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth-context';
import { fetchRetry } from '../utils/fetchRetry';

export function useFetchByPage<T>(url: string, page: number, useToken: boolean = false, dataKey: string) {
    const { token, loading: authLoading, refreshToken } = useAuth();
    const [data, setData] = useState<{ data: T[]; next?: string | null }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        if (authLoading) return;

        setLoading(true);
        setError(null);

        try {
            const headers: HeadersInit = { 'Content-Type': 'application/json' };

            if (useToken && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetchRetry(`${url}?page=${page ?? 1}`, 2000, 1, { headers });

            if (response.status === 401 && useToken) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetchRetry(`${url}?page=${page ?? 1}`, 2000, 1, { headers: retryHeaders });

                    if (!retryResponse.ok) {
                        throw new Error(`HTTP error! status: ${retryResponse.status}`);
                    }

                    const retryJson = await retryResponse.json();
                    const dataFromResponse = retryJson[dataKey] || [];
                    setHasMore(retryJson.currentPage < retryJson.totalPages || !!retryJson.next);

                    if (JSON.stringify(dataFromResponse) !== JSON.stringify(data.data)) {
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

                        sessionStorage.setItem(dataKey, JSON.stringify(dataFromResponse));
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

            if (JSON.stringify(dataFromResponse) !== JSON.stringify(data.data)) {
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

                sessionStorage.setItem(dataKey, JSON.stringify(dataFromResponse));
            }

        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [url, page, useToken, dataKey, token, authLoading, refreshToken, data.data]);

    useEffect(() => {
        const storedData = sessionStorage.getItem(dataKey);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setData({ data: parsedData });
            setLoading(false); 
        } else {
            fetchData();
        }
    }, [dataKey, fetchData]);

    const refetch = useCallback(() => {
        sessionStorage.removeItem(dataKey);
        fetchData();
    }, [fetchData, dataKey]);

    return { data, loading, error, hasMore, refetch };
};