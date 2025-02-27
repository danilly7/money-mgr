import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/auth-context";
import { apiTransactions } from "../api";
import { Transaction } from "../components/transactions/interface-transaction";

interface UseFetchTransactionResult {
    transaction: Transaction | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export const useFetchTransaction = (transactionId: number): UseFetchTransactionResult => {
    const { token, refreshToken, loading: authLoading } = useAuth();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

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

            const response = await fetch(`${apiTransactions}/${transactionId}`, { headers });

            if (response.status === 401 && token) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(`${apiTransactions}/transactions/${transactionId}`, { headers: retryHeaders });

                    if (!retryResponse.ok) {
                        throw new Error("Failed to fetch transaction after token refresh");
                    }

                    const retryJson = await retryResponse.json();
                    setTransaction(retryJson);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error("Failed to fetch transaction");
            }

            const json = await response.json();
            setTransaction(json);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [transactionId, token, authLoading, refreshToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        setTransaction(null);
        fetchData();
    }, [fetchData]);

    return { transaction, loading, error, refetch };
};