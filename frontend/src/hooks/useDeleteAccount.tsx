import { useState } from 'react';
import { getAuthToken } from '../firebase/auth';
import { apiAccounts } from '../api';

export const useDeleteAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteAccount = async (id: number) => {
        setLoading(true);
        try {
            const token = await getAuthToken();
            if (!token) throw new Error("Authentication token is missing.");

            const response = await fetch(`${apiAccounts}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete account');
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteAccount, loading, error };
};