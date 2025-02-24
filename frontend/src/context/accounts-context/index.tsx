import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Account } from "../../components/accounts/interface-account";
import { useFetchAll } from '../../hooks/useFetchAll';
import { getAuthToken } from '../../firebase/auth';
import { apiAccounts } from '../../api';
import { useAuth } from '../auth-context';
import { useFetchAccountId } from '../../hooks/useFetchAccountId';

interface AccountsContextType {
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, account: Account) => void;
  deleteAccount: (id: number) => void;
  accountId: number | null;
  getVisibleBalance: () => number;
}

interface AccountsProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children }) => {
  const { data: fetchedAccounts, loading, error } = useFetchAll<Account>(apiAccounts, 'accounts', true);
  const { userId } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>(fetchedAccounts.data);
  const [accountId, setAccountId] = useState<number | null>(null);

  useEffect(() => {
    setAccounts(fetchedAccounts.data);
  }, [fetchedAccounts]);

  const { accountId: fetchedAccountId } = useFetchAccountId("AccountName", userId);
  useEffect(() => {
    if (fetchedAccountId) {
      setAccountId(fetchedAccountId);
    }
  }, [fetchedAccountId]);

  const getVisibleBalance = () => {
    return accounts
      .filter(account => account.visibility)
      .reduce((sum, account) => {
        const balance = Number(account.balance);
        if (!isNaN(balance)) {
          return sum + balance;
        }
        return sum;
      }, 0);
  };

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

      const newAccount = await response.json();
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
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

      setAccounts(accounts.map(acc => acc.id_account === id ? { ...acc, ...account } : acc));
      if (account.id_account === accountId) {
        setAccountId(account.id_account);
      }
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

      setAccounts(accounts.filter(acc => acc.id_account !== id));
      if (id === accountId) {
        setAccountId(null); 
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, addAccount, updateAccount, deleteAccount, accountId, getVisibleBalance }}>
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