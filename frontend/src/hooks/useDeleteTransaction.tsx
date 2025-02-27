import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { apiTransactions } from "../api";

export const useDeleteTransaction = () => {
    const { token, refreshToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteTransaction = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(`${apiTransactions}/${id}`, {
                method: "DELETE",
                headers,
            });

            if (response.status === 401) {
                console.warn("Token expired, refreshing...");
                const newToken = await refreshToken();

                if (newToken) {
                    const retryHeaders: HeadersInit = {
                        "Authorization": `Bearer ${newToken}`,
                    };

                    const retryResponse = await fetch(`${apiTransactions}/${id}`, {
                        method: "DELETE",
                        headers: retryHeaders,
                    });

                    if (!retryResponse.ok) {
                        throw new Error("Failed to delete transaction after token refresh");
                    }

                    return;
                } else {
                    throw new Error("Failed to refresh token.");
                }
            }

            if (!response.ok) {
                throw new Error("Failed to delete transaction.");
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteTransaction, loading, error };
};