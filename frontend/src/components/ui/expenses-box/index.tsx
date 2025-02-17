import React from "react";
import { FlameIcon } from "../icons/FlameIcon";
import { formattedNumbers } from "../../../utils/formattedNumbers";

interface ExpensesBoxProps {
  expenses: number;
}

const ExpensesBox: React.FC<ExpensesBoxProps> = ({ expenses }) => {
    return (
        <div className="flex items-start justify-center m-2">
          <div className="relative w-54 h-44 bg-[#FF6B6B] border-4 border-black rounded-2xl 
                          flex items-center justify-center text-black p-8 transition-all duration-300 
                          overflow-hidden hover:scale-105 hover:shadow-xl">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-black text-xl font-bold">Expenses</p>
                <FlameIcon className="w-9 h-9" />
                <span className="text-2xl sm:text-3xl font-bold mt-3">
                {formattedNumbers(expenses)} <span className="text-black">€</span>
                </span>
            </div>
          </div>
        </div>
      );
};

export default ExpensesBox;