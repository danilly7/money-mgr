import React, { createContext, useContext, useState } from 'react';
import { useFetchByPage } from '../../hooks/useFetchByPage';
import { Transaction } from '../../components/transactions/interface-transaction';
import { apiTransactions } from '../../api';

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState(1);

  const { data: fetchedTransactions, loading, error, hasMore } = useFetchByPage<Transaction>(
    apiTransactions,
    page,
    true,
    'transactions'
  );

  const transactions = fetchedTransactions.data ?? [];

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <TransactionsContext.Provider value={{ transactions, loading, error, loadMore, hasMore }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};