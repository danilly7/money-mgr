import React from "react";
import { FireExtinguisherIcon } from "../icons/FireExtinguisherIcon";
import { formattedNumbers } from "../../../utils/formattedNumbers";

interface IncomeBoxProps {
  income: number;
}

const IncomeBox: React.FC<IncomeBoxProps> = ({ income }) => {
    return (
        <div className="flex items-start justify-center m-2">
          <div className="relative w-54 h-44 bg-personalizedGreen border-4 border-black rounded-2xl 
                          flex items-center justify-center text-black p-8 transition-all duration-300 
                          overflow-hidden hover:scale-105 hover:shadow-xl">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-black text-xl font-bold">Income</p>
                <FireExtinguisherIcon className="w-9 h-9" />
                <span className="text-3xl font-bold mt-3">
                  {formattedNumbers(income)} <span className="text-black">€</span>
                </span>
            </div>
          </div>
        </div>
      );
};

export default IncomeBox;