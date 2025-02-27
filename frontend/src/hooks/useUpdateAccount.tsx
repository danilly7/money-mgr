import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiAccounts } from '../api';
import { Account } from '../components/accounts/interface-account';

export const useUpdateAccount = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const updateAccount = async (id: number, account: Account) => {
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

            const response = await fetch(`${apiAccounts}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(account),
            });

            if (response.status === 401) {
                console.warn("Token expired, getting a new one...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    };

                    const retryResponse = await fetch(`${apiAccounts}/${id}`, {
                        method: 'PUT',
                        headers: retryHeaders,
                        body: JSON.stringify(account),
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Failed to update account after token refresh');
                    }

                    return;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error('Failed to update account');
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateAccount, loading, error };
};