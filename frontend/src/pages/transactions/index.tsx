import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";
import { BackButton } from "../../components/ui/back-btn";
// import TransactionList from "../../components/transactions/crud/read";
// import mockTransactions from "../../utils/mockTransactions";

const ViewOfTransactions = () => {
  const location = useLocation();
  const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [isExpense, setIsExpense] = useState(true);

  // Extraemos los parámetros de la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeframeParam = queryParams.get("timeframe") as "Day" | "Week" | "Month" | "Year";
    const isExpenseParam = queryParams.get("isExpense") === "true";

    if (timeframeParam) setTimeframe(timeframeParam);
    setIsExpense(isExpenseParam);
  }, [location.search]);

  // Filtrar las transacciones basadas en el timeframe y isExpense
//   const filteredTransactions = mockTransactions.filter((transaction) => {
//     // const withinTimeframe = (timeframe === "Month" && transaction.date.includes("2024-02")) || true; // Aquí puedes agregar tu lógica de filtrado por fecha
//     // const isMatchingExpense = transaction.isExpense === isExpense;
//     return withinTimeframe && isMatchingExpense;
//   });

  return (
    <>
      <BackButton />
      <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />
      <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
      {/* <TransactionList transactions={filteredTransactions} /> */}
    </>
  );
};

export default ViewOfTransactions;
