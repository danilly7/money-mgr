import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";
import { BackButton } from "../../components/ui/back-btn";
import TransactionList from "../../components/transactions/crud/read-all";
import { AddButton } from "../../components/ui/add-btn";

const ViewOfTransactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { timeframe, setTimeframe, isExpense, setIsExpense } = useTransactions();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeframeParam = queryParams.get("timeframe") as "Day" | "Week" | "Month" | "Year";
    const isExpenseParam = queryParams.get("isExpense") === "true";

    if (timeframeParam && timeframeParam !== timeframe) {
      setTimeframe(timeframeParam);
    }

    if (isExpenseParam !== isExpense) {
      setIsExpense(isExpenseParam);
    }
  }, [location.search, timeframe, isExpense, setTimeframe, setIsExpense]);

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
        <TransactionList isExpense={isExpense} timeframe={timeframe} />
      </div>
      <div className="flex flex-row justify-center mb-7">
        <AddButton to="/transactions/newtransaction" />
      </div>
    </>
  );
};

export default ViewOfTransactions;