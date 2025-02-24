import { useState, useEffect, useCallback } from "react";
import { Account } from "../components/accounts/interface-account";
import { apiAccounts } from "../api";
import { getAuthToken } from "../firebase/auth";

interface UseFetchAccountResult {
    account: Account | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export const useFetchAccount = (accountId: number): UseFetchAccountResult => {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAccount = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = await getAuthToken();
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const response = await fetch(`${apiAccounts}/${accountId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

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
    }, [accountId]);

    useEffect(() => {
        fetchAccount();
    }, [accountId, fetchAccount]);

    return { account, loading, error, refetch: fetchAccount };
};