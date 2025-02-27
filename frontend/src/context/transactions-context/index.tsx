import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useFetchByPage } from '../../hooks/useFetchByPage';
import { Transaction } from '../../components/transactions/interface-transaction';
import { apiTransactions } from '../../api';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useCategories } from '../categories-context';

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
  timeframe: 'Day' | 'Week' | 'Month' | 'Year';
  setTimeframe: (timeframe: 'Day' | 'Week' | 'Month' | 'Year') => void;
  totalExpense: number;
  totalIncome: number;
  refetch: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  const { data: fetchedTransactions, loading, error, hasMore, refetch } = useFetchByPage<Transaction>(
    apiTransactions,
    page,
    true,
    'transactions'
  );

  const { categories } = useCategories();

  useEffect(() => {
    setPage(1);
    refetch();
  }, [timeframe, refetch]);

  const getStartOfTimeframe = (date: Date, timeframe: 'Day' | 'Week' | 'Month' | 'Year') => {
    switch (timeframe) {
      case 'Day':
        return startOfDay(date);
      case 'Week':
        return startOfWeek(date);
      case 'Month':
        return startOfMonth(date);
      case 'Year':
        return startOfYear(date);
      default:
        return date;
    }
  };

  const getEndOfTimeframe = (date: Date, timeframe: 'Day' | 'Week' | 'Month' | 'Year') => {
    switch (timeframe) {
      case 'Day':
        return endOfDay(date);
      case 'Week':
        return endOfWeek(date);
      case 'Month':
        return endOfMonth(date);
      case 'Year':
        return endOfYear(date);
      default:
        return date;
    }
  };

  const transactions = useMemo(() => {
    const today = new Date();

    const filterByTimeframe = (date: Date) => {
      return isWithinInterval(date, {
        start: getStartOfTimeframe(today, timeframe),
        end: getEndOfTimeframe(today, timeframe),
      });
    };

    return fetchedTransactions.data?.filter((transaction) => filterByTimeframe(transaction.date)) ?? [];
  }, [fetchedTransactions.data, timeframe]);

  const { totalExpense, totalIncome } = useMemo(() => {
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach((transaction) => {
      const category = categories.find((cat) => cat.id === transaction.category_id);
      if (category) {
        if (category.type === 'expense') {
          totalExpense += Number(transaction.amount);
        } else if (category.type === 'income') {
          totalIncome += Number(transaction.amount);
        }
      }
    });

    return { totalExpense, totalIncome };
  }, [transactions, categories]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    if (transactions.length > 0) {
      const today = new Date();
      const oldestTransactionDate = new Date(transactions[transactions.length - 1].date);

      const isOldestTransactionOutsideTimeframe = !isWithinInterval(oldestTransactionDate, {
        start: getStartOfTimeframe(today, timeframe),
        end: getEndOfTimeframe(today, timeframe),
      });

      if (isOldestTransactionOutsideTimeframe && hasMore) {
        loadMore();
      }
    }
  }, [transactions, timeframe, hasMore, loadMore]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        loadMore,
        hasMore,
        timeframe,
        setTimeframe,
        totalExpense,
        totalIncome,
        refetch,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};