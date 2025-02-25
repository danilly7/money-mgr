import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";
import { BackButton } from "../../components/ui/back-btn";
import mockTransactions from "../../utils/mockTransactions";
import TransactionList from "../../components/transactions/crud/read-all";
import { useCategories } from "../../context/categories-context";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { PlusButton } from "../../components/ui/plus-btn";

const ViewOfTransactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [isExpense, setIsExpense] = useState(true);

  const transactions = mockTransactions;

  const filterByTimeframe = (date: string) => {
    const transactionDate = new Date(date);
    const today = new Date();

    switch (timeframe) {
      case "Day":
        return isWithinInterval(transactionDate, {
          start: startOfDay(today),
          end: endOfDay(today),
        });

      case "Week":
        return isWithinInterval(transactionDate, {
          start: startOfWeek(today),
          end: endOfWeek(today),
        });

      case "Month":
        return isWithinInterval(transactionDate, {
          start: startOfMonth(today),
          end: endOfMonth(today),
        });

      case "Year":
        return isWithinInterval(transactionDate, {
          start: startOfYear(today),
          end: endOfYear(today),
        });

      default:
        return false;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const category = categories.find((cat) => cat.id === transaction.category_id);
    if (!category) return false;

    const isTimeframeValid = filterByTimeframe(transaction.date);
    if (!isTimeframeValid) return false;

    if (isExpense) {
      return category.type === "expense";
    }
    return category.type === "income";
  });

  //URL con el nuevo timeframe y tipo
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeframeParam = queryParams.get("timeframe") as "Day" | "Week" | "Month" | "Year";
    const isExpenseParam = queryParams.get("isExpense") === "true";

    if (timeframeParam) setTimeframe(timeframeParam);
    setIsExpense(isExpenseParam);
  }, [location.search]);

  const handleTimeframeChange = (newTimeframe: "Day" | "Week" | "Month" | "Year") => {
    setTimeframe(newTimeframe);
    navigate(`?timeframe=${newTimeframe}&isExpense=${isExpense}`);
  };

  const handleExpenseIncomeChange = (newIsExpense: boolean) => {
    setIsExpense(newIsExpense);
    navigate(`?timeframe=${timeframe}&isExpense=${newIsExpense}`);
  };

  return (
    <>
      <BackButton goTo="/" />
      <div className="flex flex-col items-center justify-center pt-6 pb-1">
        <h1 className="text-4xl font-bold text-center whitespace-pre-line">
          A view of
          {"\n"}your Transactions
        </h1>
      </div>
      <SwitchExpenseIncome
        isExpense={isExpense}
        setIsExpense={setIsExpense}
        handleExpenseIncomeChange={handleExpenseIncomeChange}
      />
      <SwitchTimeframe timeframe={timeframe} setTimeframe={handleTimeframeChange} />
      <div className="px-4">
        <TransactionList transactions={filteredTransactions} isExpense={isExpense} />
      </div>
      <div className="flex flex-row justify-center mb-7">
        <PlusButton to="/transactions/newtransaction" />
      </div>
    </>
  );
};

export default ViewOfTransactions;