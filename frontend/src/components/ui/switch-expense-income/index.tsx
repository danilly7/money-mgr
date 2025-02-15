import { useState } from "react";

const SwitchExpenseIncome = () => {
  const [isExpense, setIsExpense] = useState(true);

  return (
    <div className="flex items-center justify-center py-6">
      <div className="relative w-96 h-16 bg-transparent border-4 border-black rounded-2xl flex">
        <button
          className={`h-full flex items-center justify-center text-2xl transition-all duration-300 px-4 relative 
            ${isExpense ? 'bg-personalizedPink text-black font-semibold w-full rounded-l-xl' : 'bg-gray-800 text-gray-200 w-1/2 rounded-l-xl'}
            hover:bg-opacity-90 uppercase`}
          onClick={() => setIsExpense(true)}
        >
          Expense
        </button>
        <div className="h-full border-r-4 border-black" />
        <button
          className={`h-full flex items-center justify-center text-2xl transition-all duration-300 px-4 relative 
            ${!isExpense ? 'bg-personalizedGreen text-black font-semibold w-full rounded-r-xl' : 'bg-gray-800 text-gray-200 w-1/2 rounded-r-xl'}
            hover:bg-opacity-90 uppercase`}
          onClick={() => setIsExpense(false)}
        >
          Income
        </button>
      </div>
    </div>
  );
};

export default SwitchExpenseIncome;