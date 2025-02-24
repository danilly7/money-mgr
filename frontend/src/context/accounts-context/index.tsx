import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Account } from "../../components/accounts/interface-account";
import { useFetchAll } from '../../hooks/useFetchAll';
import { apiAccounts } from '../../api';

interface AccountsContextType {
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  getVisibleBalance: () => number;
}

interface AccountsProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children}) => {
  const { data: fetchedAccounts, loading, error } = useFetchAll<Account>(apiAccounts, 'accounts', true);
  const [accounts, setAccounts] = useState<Account[]>(fetchedAccounts.data);

  useEffect(() => {
    setAccounts(fetchedAccounts.data);
  }, [fetchedAccounts]);

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

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, getVisibleBalance }}>
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