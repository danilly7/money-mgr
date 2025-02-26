import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiTransactions } from '../api';
import { Transaction } from '../components/transactions/interface-transaction';

export const useAddTransaction = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addTransaction = async (transaction: Transaction) => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(apiTransactions, {
                method: 'POST',
                headers,
                body: JSON.stringify(transaction),
            });

            if (response.status === 401) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(apiTransactions, {
                        method: 'POST',
                        headers: retryHeaders,
                        body: JSON.stringify(transaction),
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Failed to create transaction after token refresh');
                    }

                    const newTransaction = await retryResponse.json();
                    return newTransaction;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            const newTransaction = await response.json();
            return newTransaction;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addTransaction, loading, error };
};