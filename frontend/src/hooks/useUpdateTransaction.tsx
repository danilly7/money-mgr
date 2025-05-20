import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiTransactions } from '../api';
import { TransactionUpdate, Transaction, ApiError } from '../components/transactions/interface-transaction';

export const useUpdateTransaction = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateTransaction = async (
        id: number, 
        updatedFields: TransactionUpdate
    ): Promise<Transaction> => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error('Authentication token is missing.');
            }

             if (updatedFields.amount !== undefined && updatedFields.amount <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const body: Record<string, unknown> = {};

            Object.entries(updatedFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'date' && value instanceof Date) {
                        body[key] = value.toISOString();
                    } else {
                        body[key] = value;
                    }
                }
            });

            const response = await fetch(`${apiTransactions}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body),
            });

           if (!response.ok) {
                const errorData: ApiError = await response.json().catch(() => ({
                    msg: `HTTP error! status: ${response.status}`
                }));

                // Manejar token expirado
                if (response.status === 401) {
                    const newToken = await refreshToken();
                    if (!newToken) {
                        throw new Error('Failed to refresh token');
                    }

                    const retryResponse = await fetch(`${apiTransactions}/${id}`, {
                        method: 'PUT',
                        headers: {
                            ...headers,
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify(body),
                    });

                    if (!retryResponse.ok) {
                        const retryError: ApiError = await retryResponse.json().catch(() => ({
                            msg: 'Failed after token refresh'
                        }));
                        throw new Error(retryError.msg);
                    }

                    return await retryResponse.json() as Transaction;
                }

                throw new Error(errorData.msg);
            }

            return await response.json() as Transaction;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error('Update transaction error:', error);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { updateTransaction, loading, error };
};