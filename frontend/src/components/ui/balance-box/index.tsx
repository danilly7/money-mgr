import React from 'react';
import { ScaleIcon } from '../icons/ScaleIcon';

interface BalanceBoxProps {
  balance: number;
}

const BalanceBox: React.FC<BalanceBoxProps> = ({ balance }) => {
  return (
    <div className="flex items-start justify-center py-4 m-4">
      <div className="relative w-[28rem] h-52 bg-personalizedGreen border-4 border-black rounded-2xl flex items-center justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-xl font-bold">Balance</p>
          <ScaleIcon className='w-9 h-9' />
          <span className="text-6xl sm:text-7xl font-bold mt-3">
            {balance.toFixed(2)} <span className="text-black">€</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;