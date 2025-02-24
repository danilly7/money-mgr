import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Account } from "../../components/accounts/interface-account";
import { useFetchAll } from '../../hooks/useFetchAll';
import { getAuthToken } from '../../firebase/auth';
import { apiAccounts } from '../../api';

interface AccountsContextType {
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, account: Account) => void;
  deleteAccount: (id: number) => void;
}

interface AccountsProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children }) => {
  const { data: fetchedAccounts, loading, error } = useFetchAll<Account>(apiAccounts, 'accounts', true);

  const [accounts, setAccounts] = useState<Account[]>(fetchedAccounts.data);

  useEffect(() => {
    setAccounts(fetchedAccounts.data);
  }, [fetchedAccounts]);

  const addAccount = async (account: Account) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Error getting the token of authentification.");
      }

      const response = await fetch(apiAccounts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      setAccounts(prevAccounts => [...prevAccounts, account]);
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const updateAccount = async (id: number, account: Account) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Error getting the token of authentification.");
      }

      const response = await fetch(`${apiAccounts}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      setAccounts(accounts.map(acc => acc.id === id ? account : acc));
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (id: number) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Error getting the token of authentification.");
      }

      const response = await fetch(`${apiAccounts}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = (): AccountsContextType => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }
  return context;
};