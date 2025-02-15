import { CategoriesList } from "../../components/categories/r/read";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";

const Categories = () => {
    return (
        <div>
            <SwitchExpenseIncome />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">CATEGORIES</h1>
            </div>
            <CategoriesList />
        </div>
    )
};

export default Categories;