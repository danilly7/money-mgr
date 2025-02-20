import { useState } from "react";
import { CategoriesList } from "../../components/categories/r/read";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";

const Categories = () => {
    const [isExpense, setIsExpense] = useState(true);

    return (
        <>
            <div className="flex flex-col items-center justify-center m-6">
                <h1 className="text-4xl font-bold">CATEGORIES</h1>
            </div>
           <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />
            <CategoriesList isExpense={isExpense} />
        </>
    )
};

export default Categories;