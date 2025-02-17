import { useState } from "react";
import SwitchTimeframe from "../../../components/ui/switch-time-frame";
import SwitchExpenseIncome from "../../../components/ui/switch-expense-income";
import { BackButton } from "../../../components/ui/back-btn";
import TransactionList from "../../../components/transactions/crud/read";
import mockTransactions from "../../../utils/mockTransactions";


const ViewOfTransactions = () => {
    console.log('Rendering ViewOfTransactions');
    const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");
    const [isExpense, setIsExpense] = useState(true);


    return (
        <>
            <BackButton />
            <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />
            <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
            <TransactionList transactions={mockTransactions} />
        </>
    );
};

export default ViewOfTransactions;