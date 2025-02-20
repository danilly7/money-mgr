import { Dispatch, SetStateAction } from "react";

interface SwitchExpenseIncomeProps {
  isExpense: boolean;
  setIsExpense: Dispatch<SetStateAction<boolean>>;
  handleExpenseIncomeChange?: (newIsExpense: boolean) => void; // Agrega la función aquí
}

const SwitchExpenseIncome: React.FC<SwitchExpenseIncomeProps> = ({ isExpense, setIsExpense, handleExpenseIncomeChange }) => {
  const handleClickExpense = () => {
    setIsExpense(true);
    handleExpenseIncomeChange?.(true);  //para la url para expenses
  };

  const handleClickIncome = () => {
    setIsExpense(false);
    handleExpenseIncomeChange?.(false);  //url para income
  };

  return (
    <div className="flex items-center justify-center pt-2 m-2">
      <div className="relative w-[28rem] h-16 bg-transparent border-4 border-black rounded-2xl flex">
        <button
          className={`h-full flex items-center justify-center text-2xl transition-all duration-300 px-4 relative 
            ${isExpense ? 'bg-personalizedPink text-black font-semibold w-full rounded-l-xl' : 'bg-gray-800 text-gray-200 w-1/2 rounded-l-xl'}`}
          onClick={handleClickExpense}
        >
          Expense
        </button>
        <div className="h-full border-r-4 border-black" />
        <button
          className={`h-full flex items-center justify-center text-2xl transition-all duration-300 px-4 relative 
            ${!isExpense ? 'bg-personalizedGreen text-black font-semibold w-full rounded-r-xl' : 'bg-gray-800 text-gray-200 w-1/2 rounded-r-xl'}`}
          onClick={handleClickIncome}
        >
          Income
        </button>
      </div>
    </div>
  );
};

export default SwitchExpenseIncome;