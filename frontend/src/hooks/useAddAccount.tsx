import { useState } from 'react';
import { getAuthToken } from '../firebase/auth';
import { apiAccounts } from '../api';
import { Account } from '../components/accounts/interface-account';

export const useAddAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addAccount = async (account: Account) => {
        setLoading(true);
        try {
            const token = await getAuthToken();
            if (!token) throw new Error("Authentication token is missing.");

            const response = await fetch(apiAccounts, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(account),
            });

            if (!response.ok) throw new Error('Failed to create account');

            const newAccount = await response.json();
            return newAccount;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addAccount, loading, error };
};