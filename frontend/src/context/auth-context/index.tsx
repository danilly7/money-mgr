import React, { useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { apiUsers } from "../../api";
import { UserDB } from "../../components/welcome/interface-user";

interface AuthContextType {
  currentUser: User | null;
  userId: number | null;
  userLoggedIn: boolean;
  loading: boolean;
  userIdLoading: boolean;
  token: string | null;
  refreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userIdLoading, setUserIdLoading] = useState(true);

  const fetchToken = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken();
      setToken(token);
      return token;
    } catch (error) {
      console.error("Error fetching token:", error);
      setToken(null);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (currentUser) {
      try {
        const newToken = await currentUser.getIdToken(true);
        setToken(newToken);
        return newToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        setToken(null);
        return null;
      }
    }
    return null;
  }, [currentUser]);

  const fetchUserId = useCallback(async (uid: string) => {
    const maxRetries = 3; // Número máximo de intentos
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        const response = await fetch(`${apiUsers}`);
        if (!response.ok) throw new Error("Error fetching user ID");

        const data = await response.json();
        const user = data.users.find((u: UserDB) => u.uid === uid);

        if (user) {
          setUserId(user.id); //este es id pq en la respuesta de la api es id
          success = true;
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        retries += 1;
        if (retries === maxRetries) {
          console.error("Failed to fetch user ID after multiple attempts:", error);
          throw new Error("User not found after multiple attempts");
        } else {
          // Esperar un tiempo antes de reintentar
          console.log(`Retrying... attempt ${retries + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo de espera
        }
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoggedIn(!!user);
      setUserIdLoading(true);

      if (user) {
        await fetchUserId(user.uid);
        await fetchToken(user);
      } else {
        setUserId(null);
        setToken(null);
        setUserIdLoading(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [fetchToken, fetchUserId]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserId(null); //limpiamos al hacer logout
      setToken(null);
      setUserIdLoading(false);
    } catch (error) {
      console.log('Error loging out:', error);
    }
  };

  const value = {
    currentUser,
    userId,
    userLoggedIn,
    loading,
    token,
    refreshToken,
    logout,
    userIdLoading
  };

  return (
    <AuthContext.Provider value={value}>
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