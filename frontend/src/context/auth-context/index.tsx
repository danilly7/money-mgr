import React, { useState, useEffect, useContext, ReactNode } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
    token: string | null;
    logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setUserLoggedIn(!!user);

            if (user) {
                try {
                    const idToken = await user.getIdToken(); //token de Firebase!!
                    setToken(idToken);
                } catch (error) {
                    console.error("Error getting token:", error);
                    setToken(null);
                }
            } else {
                setToken(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setToken(null); //logout y se limpia token
    };

    return (
        <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, token, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};