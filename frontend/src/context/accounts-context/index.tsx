import React, { createContext, useContext, ReactNode } from 'react';
import { Account } from "../../components/accounts/interface-account";
import { useFetchAll } from '../../hooks/useFetchAll';
import { apiAccounts } from '../../api';

interface AccountsContextType {
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  getVisibleBalance: () => number;
  refetchAccounts: () => void;
}

interface AccountsProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children}) => {
  const { data: fetchedAccounts, loading, error, refetch } = useFetchAll<Account>(apiAccounts, 'accounts', true);
  
  const accounts = fetchedAccounts.data ?? [];

  const getVisibleBalance = () => {
    return accounts
      .filter(account => account.visibility)
      .reduce((sum, account) => {
        const balance = Number(account.balance);
        return isNaN(balance) ? sum : sum + balance;
      }, 0);
  };

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, getVisibleBalance, refetchAccounts: refetch }}>
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