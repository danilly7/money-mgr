import React, { createContext, useContext, ReactNode } from 'react';
import { Account } from "../../components/accounts/interface-account";
import { useFetchAll } from '../../hooks/useFetchAll';
import { apiAccounts } from '../../api';

interface AccountsContextType { //básicamente este context es un useFetchAllAccounts y refetch hook accesible a muchos
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  refetchAccounts: () => void;
}

interface AccountsProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children}) => {
  const { data: fetchedAccounts, loading, error, refetch } = useFetchAll<Account>(apiAccounts, 'accounts', true);
  
  const accounts = fetchedAccounts.data ?? [];

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, refetchAccounts: refetch }}>
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