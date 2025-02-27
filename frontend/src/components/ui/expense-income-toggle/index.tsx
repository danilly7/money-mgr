import React from "react";
import { FlameIcon } from "../icons/FlameIcon";
import { FireExtinguisherIcon } from "../icons/FireExtinguisherIcon";
import { formattedNumbers } from "../../../utils/formattedNumbers";

interface ExpenseIncomeToggleProps {
  isExpense: boolean;
  setIsExpense: React.Dispatch<React.SetStateAction<boolean>>;
  amountExpense: number;
  amountIncome: number;
}

const ExpenseIncomeToggle: React.FC<ExpenseIncomeToggleProps> = ({
  isExpense, 
  setIsExpense, 
  amountExpense, 
  amountIncome
}) => {
  return (
    <div className="flex space-x-3 justify-center">
      <button
        onClick={() => setIsExpense(true)}
        className={`relative w-54 h-44 ${isExpense ? "bg-[#FF6B6B]" : "bg-gray-300"} 
                    border-4 border-black rounded-2xl flex items-center justify-center text-black p-4 
                    transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-lg md:text-xl font-bold">Expenses</p>
          <FlameIcon className="w-9 h-9" />
          <span className="text-2xl md:text-4xl font-bold mt-3">
            {formattedNumbers(amountExpense)} <span className="text-black">€</span>
          </span>
        </div>
      </button>

      <button
        onClick={() => setIsExpense(false)}
        className={`relative w-54 h-44 ${!isExpense ? "bg-personalizedGreen" : "bg-gray-300"} 
                    border-4 border-black rounded-2xl flex items-center justify-center text-black p-4 
                    transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-lg md:text-xl font-bold">Income</p>
          <FireExtinguisherIcon className="w-9 h-9" />
          <span className="text-2xl md:text-4xl font-bold mt-3">
            {formattedNumbers(amountIncome)} <span className="text-black">€</span>
          </span>
        </div>
      </button>
    </div>
  );
};

export default ExpenseIncomeToggle;