import React, { useState, useEffect, useCallback } from "react";
import { formattedNumbers } from "../../../utils/formattedNumbers";
import { useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "../../../context/categories-context";
import { useTransactions } from "../../../context/transactions-context";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface CategoryTotal {
  categoryName: string;
  total: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface TransactionsByCategoryProps {
  isExpense: boolean;
}

const TransactionsByCategory: React.FC<TransactionsByCategoryProps> = ({ isExpense }) => {
  const { transactions, loading, error, loadMore, timeframe } = useTransactions();
  const { categories } = useCategories();
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const filterByTimeframe = useCallback((date: Date) => {
    const today = new Date();

    switch (timeframe) {
      case "Day":
        return isWithinInterval(date, {
          start: startOfDay(today),
          end: endOfDay(today),
        });

      case "Week":
        return isWithinInterval(date, {
          start: startOfWeek(today),
          end: endOfWeek(today),
        });

      case "Month":
        return isWithinInterval(date, {
          start: startOfMonth(today),
          end: endOfMonth(today),
        });

      case "Year":
        return isWithinInterval(date, {
          start: startOfYear(today),
          end: endOfYear(today),
        });

      default:
        return false;
    }
  }, [timeframe]);

  useEffect(() => {
    if (transactions && categories) {
      const groupedByCategory: {
        [key: number]: {
          total: number;
          name: string;
          icon: React.ComponentType<{ className?: string }>;
        }
      } = {};

      transactions.forEach((transaction) => {
        const isTimeframeValid = filterByTimeframe(transaction.date);
        const category = categories.find(cat => cat.id === transaction.category_id);

        if (isTimeframeValid && category && category.type === (isExpense ? "expense" : "income")) {
          if (!groupedByCategory[transaction.category_id]) {
            groupedByCategory[transaction.category_id] = {
              total: 0,
              name: category.name,
              icon: category.icon,
            };
          }
          groupedByCategory[transaction.category_id].total += Number(transaction.amount);
        }
      });

      setCategoryTotals(
        Object.values(groupedByCategory).map((data) => ({
          categoryName: data.name,
          total: data.total,
          icon: data.icon,
        }))
      );
    }
  }, [transactions, categories, timeframe, isExpense, filterByTimeframe]);

  useEffect(() => {
    loadMore();
  }, [location, loadMore]);

  const handleCategoryClick = () => {
    navigate(`/transactions?timeframe=${timeframe}&isExpense=${isExpense}`);
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    if (error.message.includes("404")) {
      return <div className="text-center text-xl font-semibold text-gray-500 mt-8">Start by adding a transaction!</div>;
    }
    return <div className="text-center text-xl font-semibold text-red-500 mt-8">Error loading transactions.</div>;
  }

  if (categoryTotals.length === 0) {
    return <div className="text-center text-xl font-semibold text-gray-500 mt-8">No transactions yet, start now!</div>;
  }

  return (
    <div className="mt-6">
      <div className="relative mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-16 bg-gray-300 border-4 border-black rounded-2xl flex items-center justify-between text-black p-4 gap-x-4 my-2">
        <div className="flex items-center justify-start w-1/2">
          <p className="text-lg sm:text-xl font-bold text-black truncate">Category</p>
        </div>

        <div className="flex items-center justify-end w-1/2">
          <p className="text-lg sm:text-xl font-bold text-black truncate">Amount</p>
        </div>
      </div>

      {categoryTotals.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <div
            key={category.categoryName || `category-${index}`}
            className={`relative mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-16 bg-gray-300 border-4 border-black rounded-2xl flex items-center justify-between text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl mb-2 gap-x-4 cursor-pointer`}
            onClick={handleCategoryClick}
          >
            <div className="flex items-center justify-start w-1/2">
              <IconComponent className={`w-6 h-6 mr-2 ${isExpense ? 'text-red-600' : 'text-green-600'}`} />
              <p className={`text-lg sm:text-xl font-bold ${isExpense ? 'text-red-600' : 'text-green-600'} truncate`}>
                {category.categoryName}
              </p>
            </div>

            <span className={`text-lg sm:text-xl font-bold ${isExpense ? 'text-red-600' : 'text-green-600'} truncate`}>
              {formattedNumbers(category.total)} €
            </span>

          </div>
        );
      })}
    </div>
  );
};

export default TransactionsByCategory;