import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiTransactions } from '../api';
import { TransactionUpdate } from '../components/transactions/interface-transaction';

export const useUpdateTransaction = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateTransaction = async (id: number, updatedFields: TransactionUpdate) => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${apiTransactions}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(updatedFields),
            });

            if (response.status === 401) {
                console.warn('Token expired, refreshing...');
                const newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('Failed to refresh token');
                }

                const retryHeaders: HeadersInit = {
                    'Authorization': `Bearer ${newToken}`,
                    'Content-Type': 'application/json',
                };

                const retryResponse = await fetch(`${apiTransactions}/${id}`, {
                    method: 'PUT',
                    headers: retryHeaders,
                    body: JSON.stringify(updatedFields),
                });

                if (!retryResponse.ok) {
                    throw new Error('Failed to update transaction after token refresh');
                }

                return await retryResponse.json();
            }

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.msg || 'Failed to update transaction');
            }

            return await response.json();
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateTransaction, loading, error };
};