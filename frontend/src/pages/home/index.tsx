import { useState } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import BalanceBox from "../../components/ui/balance-box";
import ExpenseIncomeToggle from "../../components/ui/expense-income-toggle";
import { SearchButton } from "../../components/ui/search-btn";
import AddButton from "../../components/ui/add-button";
import useVisibleBalance from "../../hooks/useVisibleBalance";
import TransactionsByCategory from "../../components/transactions/filter-by-category";
import { useTransactions } from "../../context/transactions-context";

const Home = () => {
    const { visibleBalance } = useVisibleBalance();
    const { timeframe, setTimeframe, totalExpense, totalIncome } = useTransactions();
    const [isExpense, setIsExpense] = useState(true);

    return (
        <>
            <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
            <BalanceBox balance={visibleBalance} />

            <ExpenseIncomeToggle
                isExpense={isExpense}
                setIsExpense={setIsExpense}
                amountExpense={totalExpense}
                amountIncome={totalIncome}
            />

            <TransactionsByCategory isExpense={isExpense} />

            <div className="flex flex-row justify-center space-x-10 m-6">
                <SearchButton to="/transactions" timeframe={timeframe} isExpense={isExpense} />
                <AddButton to="transactions/newtransaction" />
            </div>
        </>
    );
};

export default Home;