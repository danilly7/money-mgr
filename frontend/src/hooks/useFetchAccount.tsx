import { useState, useEffect, useCallback } from "react";
import { Account } from "../components/accounts/interface-account";
import { apiAccounts } from "../api";
import { useAuth } from "../context/auth-context";

interface UseFetchAccountResult {
    account: Account | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export const useFetchAccount = (accountId: number): UseFetchAccountResult => {
    const { token, refreshToken } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAccount = useCallback(async () => {
        if (accountId === 0) {
            setAccount(null);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${apiAccounts}/${accountId}`, {
                headers,
            });

            if (response.status === 401) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    };

                    const retryResponse = await fetch(`${apiAccounts}/${accountId}`, {
                        headers: retryHeaders,
                    });

                    if (!retryResponse.ok) {
                        throw new Error("Failed to fetch account after token refresh");
                    }

                    const data = await retryResponse.json();
                    setAccount(data);
                    return;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error("Failed to fetch account");
            }

            const data = await response.json();
            setAccount(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [accountId, token, refreshToken]);

    useEffect(() => {
        fetchAccount();
    }, [accountId, fetchAccount]);

    return { account, loading, error, refetch: fetchAccount };
};