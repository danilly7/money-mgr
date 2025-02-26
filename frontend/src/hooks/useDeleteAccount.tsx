import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiAccounts } from '../api';

export const useDeleteAccount = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteAccount = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(`${apiAccounts}/${id}`, {
                method: 'DELETE',
                headers,
            });

            if (response.status === 401) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Authorization': `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(`${apiAccounts}/${id}`, {
                        method: 'DELETE',
                        headers: retryHeaders,
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Failed to delete account after token refresh');
                    }

                    return;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteAccount, loading, error };
};