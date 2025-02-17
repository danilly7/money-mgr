import { useState } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import BalanceBox from "../../components/ui/balance-box";
import ExpensesBox from "../../components/ui/expenses-box";
import IncomeBox from "../../components/ui/income-box";
import { SearchButton } from "../../components/ui/search-btn";
import { PlusButton } from "../../components/ui/plus-btn";

const Home = () => {
    const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");


    return (
        <>
            <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
            <BalanceBox balance={1150.5} />
            <div className="flex flex-col justify-center sm:flex-row">
                <ExpensesBox expenses={100.00} />
                <IncomeBox income={500} />
            </div>
            <div className="flex flex-col justify-center sm:flex-row space-x-8 m-6">
                <SearchButton to="/details" />
                <PlusButton to="/newaccount" />
            </div>
        </>
    );
};

export default Home;