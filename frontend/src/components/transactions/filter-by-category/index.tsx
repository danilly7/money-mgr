import React, { useState, useEffect, useCallback } from "react";
import { formattedNumbers } from "../../../utils/formattedNumbers";
import { useNavigate, useLocation } from "react-router-dom";
import { useCategories } from "../../../context/categories-context";
import { useTransactions } from "../../../context/transactions-context";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface CategoryTotal {
  categoryName: string;
  total: number;
}

interface TransactionsByCategoryProps {
  isExpense: boolean;
}

const TransactionsByCategory: React.FC<TransactionsByCategoryProps> = ({ isExpense }) => {
  const { transactions, loading, error, loadMore, timeframe } = useTransactions();
  const { categories } = useCategories();
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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
      const groupedByCategory: { [key: number]: { total: number; name: string } } = {};

      transactions.forEach((transaction) => {
        const isTimeframeValid = filterByTimeframe(transaction.date);
        const category = categories.find(cat => cat.id === transaction.category_id);

        if (isTimeframeValid && category && category.type === (isExpense ? "expense" : "income")) {
          if (!groupedByCategory[transaction.category_id]) {
            groupedByCategory[transaction.category_id] = { total: 0, name: category.name };
          }
          groupedByCategory[transaction.category_id].total += Number(transaction.amount);
        }
      });

      setCategoryTotals(
        Object.values(groupedByCategory).map((data) => ({
          categoryName: data.name,
          total: data.total,
        }))
      );
    }
  }, [transactions, categories, timeframe, isExpense, filterByTimeframe]);

  useEffect(() => {
    loadMore();
  }, [location, loadMore]);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/categories/${categoryName}`);
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold text-red-500">Error loading transactions.</div>;
  }

  return (
    <>
      <div className="relative max-w-lg mx-auto h-22 bg-personalizedPink border-4 border-black rounded-2xl flex items-center text-black p-4 mb-2">
        <div className="flex items-center justify-start w-[200px]">
          <p className="text-xl font-bold text-black">Category</p>
        </div>

        <div className="flex items-center justify-end w-[200px]">
          <p className="text-xl font-bold text-black">Amount</p>
        </div>
      </div>

      {categoryTotals.length > 0 ? (
        categoryTotals.map((category, index) => (
          <div
            key={category.categoryName || `category-${index}`}
            className="relative max-w-lg mx-auto h-22 bg-slate-300 border-4 border-black rounded-2xl flex items-center text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer mb-2 gap-x-6"
            onClick={() => handleCategoryClick(category.categoryName)}
          >
            <div className="flex items-center justify-start w-[200px]">
              <p className="text-xl font-bold text-black truncate">{category.categoryName}</p>
            </div>

            <div className="flex items-center justify-end w-[200px]">
              <span className="text-xl font-bold text-black">
                {formattedNumbers(category.total)} €
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-xl font-semibold text-gray-500">No categories available</div>
      )}
    </>
  );
};

export default TransactionsByCategory;