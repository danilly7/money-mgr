import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/auth-context";
import { apiTransactions } from "../api";
import { Transaction } from "../components/transactions/interface-transaction";

interface UseFetchTransactionResult {
    transaction: Transaction[];
    loading: boolean;
    error: Error | null;
    hasMore: boolean;
    refetch: () => void;
}

export const useFetchTransaction = (page: number): UseFetchTransactionResult => {
    const { token, refreshToken, loading: authLoading } = useAuth();
    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        if (authLoading) return;

        setLoading(true);
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${apiTransactions}/transactions?page=${page}`, { headers });

            if (response.status === 401 && token) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(`${apiTransactions}/transactions?page=${page}`, { headers: retryHeaders });

                    if (!retryResponse.ok) {
                        throw new Error("Failed to fetch transactions after token refresh");
                    }

                    const retryJson = await retryResponse.json();
                    setHasMore(retryJson.currentPage < retryJson.totalPages || !!retryJson.next);

                    setTransaction(prevTransaction => [
                        ...prevTransaction,
                        ...(Array.isArray(retryJson.data) ? retryJson.data : []),
                    ]);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const json = await response.json();
            setHasMore(json.currentPage < json.totalPages || !!json.next);

            setTransaction(prevTransaction => [
                ...prevTransaction,
                ...(Array.isArray(json.data) ? json.data : []),
            ]);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [page, token, authLoading, refreshToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        setTransaction([]);
        fetchData();
    }, [fetchData]);

    return { transaction, loading, error, hasMore, refetch };
};