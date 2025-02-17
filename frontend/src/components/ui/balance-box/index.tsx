import React from 'react';
import { ScaleIcon } from '../icons/ScaleIcon';
import { formattedNumbers } from '../../../utils/formattedNumbers';

interface BalanceBoxProps {
  balance: number;
}

const BalanceBox: React.FC<BalanceBoxProps> = ({ balance }) => {
  return (
    <div className="flex items-start justify-center py-4 m-4">
      <div className="relative w-[28rem] h-52 bg-[#9D4EDD] border-4 border-black rounded-2xl
      flex items-center justify-center text-black p-8 transition-all duration-300
      overflow-hidden hover:scale-105 hover:shadow-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-xl font-bold">Balance</p>
          <ScaleIcon className='w-9 h-9' />
          <span className="text-5xl sm:text-6xl font-bold mt-3">
            {formattedNumbers(balance)} <span className="text-black">€</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;