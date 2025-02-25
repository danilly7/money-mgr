import { useState } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import BalanceBox from "../../components/ui/balance-box";
import ExpenseIncomeToggle from "../../components/ui/expense-income-toggle";
import { SearchButton } from "../../components/ui/search-btn";
import { PlusButton } from "../../components/ui/plus-btn";
import useVisibleBalance from "../../hooks/useVisibleBalance";

const Home = () => {
    const { visibleBalance } = useVisibleBalance();
    const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");
    const [isExpense, setIsExpense] = useState(true);
    const amountExpense = 1250.5;
    const amountIncome = 2000.75;

    return (
        <>
            <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
            <BalanceBox balance={visibleBalance} />

            <ExpenseIncomeToggle
                isExpense={isExpense}
                setIsExpense={setIsExpense}
                amountExpense={amountExpense}
                amountIncome={amountIncome}
            />

            <div className="flex flex-row justify-center space-x-10 m-6">
                <SearchButton to="/transactions" timeframe={timeframe} isExpense={isExpense} />
                <PlusButton to="/newtransaction" />
            </div>
        </>
    );
};

export default Home;