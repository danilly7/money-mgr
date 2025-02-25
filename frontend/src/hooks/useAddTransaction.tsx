import { useState } from 'react';
import { getAuthToken } from '../firebase/auth';
import { apiTransactions } from '../api';
import { Transaction } from '../components/transactions/interface-transaction';

export const useAddTransaction = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addTransaction = async (transaction: Transaction) => {
        setLoading(true);
        try {
            const token = await getAuthToken();
            if (!token) throw new Error("Authentication token is missing.");

            const response = await fetch(apiTransactions, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(transaction),
            });

            if (!response.ok) throw new Error('Failed to create transaction');

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