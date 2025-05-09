import React, { useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { apiUsers } from "../../api";
import { UserDB } from "../../components/intro/interface-user";

interface AuthContextType {
  currentUser: User | null;
  userId: number | null;
  userLoggedIn: boolean;
  loading: boolean;
  userIdLoading: boolean;
  token: string | null;
  refreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken();
      setToken(token);
      return token;
    } catch (error) {
      console.error("Error fetching token:", error);
      setToken(null);
      setError("Failed to fetch token");
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
        setError("Failed to refresh token");
        return null;
      }
    }
    return null;
  }, [currentUser]);

  const fetchUserId = useCallback(async (uid: string, attempts = 5) => {
    try {
      const response = await fetch(`${apiUsers}`);
      if (!response.ok) throw new Error("Error fetching user ID");

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        const user = data.users.find((u: UserDB) => u.uid === uid);

        if (user) {
          setUserId(user.id); //este es id pq en la respuesta de la api es id
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      if (attempts > 1) {
        console.log(`Attempt failed, retrying... You have ${attempts - 1} of 5 attempts left.`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchUserId(uid, attempts - 1);
      }

      console.error("Failed to fetch user ID after multiple attempts:", error);
      setError("Failed to fetch user ID");
    }
  }, []); //el useCallback asegura que fetchUserId no cambie a menos que sea necesario

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
      setError("Failed to log out");
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
    error,
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