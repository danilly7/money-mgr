import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiAccounts } from '../api';
import { Account } from '../components/accounts/interface-account';

export const useAddAccount = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addAccount = async (account: Account) => {
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

            const response = await fetch(apiAccounts, {
                method: 'POST',
                headers,
                body: JSON.stringify(account),
            });

            if (response.status === 401) {
                console.warn("Token expirado, intentando renovarlo...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(apiAccounts, {
                        method: 'POST',
                        headers: retryHeaders,
                        body: JSON.stringify(account),
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Failed to create account after token refresh');
                    }

                    const newAccount = await retryResponse.json();
                    return newAccount;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

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