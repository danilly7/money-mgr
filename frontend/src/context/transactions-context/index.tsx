import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
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
  isExpense: boolean;
  setIsExpense: Dispatch<SetStateAction<boolean>>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');
  const [isExpense, setIsExpense] = useState(true);

  const { data: fetchedTransactions = { data: [] }, loading, error, hasMore, refetch } = useFetchByPage<Transaction>(
    apiTransactions,
    page,
    true,
    'transactions'
  );

  const { categories } = useCategories();

  const getTimeframeRange = useCallback((date: Date, timeframe: 'Day' | 'Week' | 'Month' | 'Year') => {
    const startFuncs = { Day: startOfDay, Week: startOfWeek, Month: startOfMonth, Year: startOfYear };
    const endFuncs = { Day: endOfDay, Week: endOfWeek, Month: endOfMonth, Year: endOfYear };
    return { start: startFuncs[timeframe](date), end: endFuncs[timeframe](date) };
  }, []);

  useEffect(() => {
    setPage(1);
    refetch();
  }, [timeframe, refetch]);

  useEffect(() => {
    if (!loading && fetchedTransactions.data.length > 0) {
      sessionStorage.setItem('transactions', JSON.stringify(fetchedTransactions.data));
    }
  }, [fetchedTransactions.data, loading]);

  const transactions = useMemo(() => {
    if (loading) return JSON.parse(sessionStorage.getItem('transactions') || '[]');

    const today = new Date();
    const { start, end } = getTimeframeRange(today, timeframe);
    
    return fetchedTransactions.data.filter((transaction) =>
      isWithinInterval(new Date(transaction.date), { start, end })
    );
  }, [fetchedTransactions.data, timeframe, loading, getTimeframeRange]);

  const { totalExpense, totalIncome } = useMemo(() => {
    return transactions.reduce(
      (totals: { totalExpense: number; totalIncome: number }, transaction: Transaction) => {
        const category = categories.find((cat) => cat.id === transaction.category_id);
        if (category?.type === 'expense') {
          totals.totalExpense += Number(transaction.amount);
        } else if (category?.type === 'income') {
          totals.totalIncome += Number(transaction.amount);
        }
        return totals;
      },
      { totalExpense: 0, totalIncome: 0 }
    );
  }, [transactions, categories]);  

  const loadMore = useCallback(() => {
    if (hasMore) setPage((prev) => prev + 1);
  }, [hasMore]);

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const oldestTransactionDate = new Date(transactions.at(-1)?.date ?? '');
      const { start, end } = getTimeframeRange(new Date(), timeframe);
      
      if (!isWithinInterval(oldestTransactionDate, { start, end }) && hasMore) {
        loadMore();
      }
    }
  }, [transactions, timeframe, hasMore, loadMore, loading, getTimeframeRange]);

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
        isExpense,
        setIsExpense
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