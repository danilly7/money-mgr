import { useState, useEffect } from "react";
import { Account } from "../components/accounts/interface-account";
import { apiAccounts } from "../api";

interface UseFetchAccountIdResult {
    accountId: number | null;
    loading: boolean;
    error: Error | null;
}

export const useFetchAccountId = (name: string, id_user: number | null): UseFetchAccountIdResult => {
    const [accountId, setAccountId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAccountId = async () => {
            if (id_user && name) {
                try {
                    const response = await fetch(apiAccounts);
                    if (!response.ok) throw new Error("Failed to fetch accounts");

                    const data = await response.json();
                    const account = data.accounts.find(
                        (account: Account) => account.name === name && account.user_id === id_user
                    );

                    if (account) {
                        setAccountId(account.id);
                    } else {
                        setError(new Error("Account not found"));
                    }
                } catch (err) {
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAccountId();
    }, [name, id_user]);

    return { accountId, loading, error };
};