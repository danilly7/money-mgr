import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth-context';
import { fetchRetry } from '../utils/fetchRetry';

export function useFetchByPage<T>(url: string, page: number, useToken: boolean = false, dataKey: string = 'data') {
    const { token, loading: authLoading, refreshToken } = useAuth();
    const [data, setData] = useState<{ data: T[]; next?: string | null }>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        if (useToken && !token) return;

        setLoading(true);
        setError(null);

        const fetchPage = async (authToken?: string | null) => {
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (useToken && authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            const response = await fetchRetry(`${url}?page=${page ?? 1}`, 2000, 1, { headers });

            if (response.status === 401 && useToken) {
                throw new Error('401');
            }

            if (!response.ok) {
                //si el status es 404, comprobamos si es un error por "usuario nuevo"
                if (response.status === 404) {
                    const json = await response.json();
                    if (json.message && json.message === "User not found") {
                        //no lanzamos error, simplemente tratamos esto como "usuario nuevo"
                        setData({ data: [] });
                        setHasMore(false); //no hay más datos que cargar
                        return;
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            const items = json[dataKey] ?? [];
            const next = json.next || null;
            const isMore = json.currentPage < json.totalPages || !!next;

            setHasMore(isMore);

            setData((prev) => ({
                data: page === 1 ? [...items] : [...prev.data, ...items],
                next,
            }));
        };

        try {
            await fetchPage(token);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === '401' && useToken) {
                    console.warn('Token expired, refreshing...');
                    const newToken = await refreshToken();
                    if (!newToken) {
                        setError(new Error('Failed to refresh token'));
                        return;
                    }
                    try {
                        await fetchPage(newToken);
                    } catch (retryError) {
                        setError(retryError instanceof Error ? retryError : new Error('Unknown retry error'));
                    }
                } else {
                    setError(err);
                }
            } else {
                setError(new Error('Unknown error occurred'));
            }
        } finally {
            setLoading(false);
        }
    }, [url, page, dataKey, useToken, token, refreshToken]);

    useEffect(() => {
        if (!authLoading && (!useToken || token)) {
            fetchData();
        }
    }, [fetchData, authLoading, useToken, token]);

    return { data, loading, error, hasMore, refetch: fetchData };
};