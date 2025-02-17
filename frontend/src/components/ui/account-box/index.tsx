import React from 'react';
import { EyeClosedIcon } from '../icons/EyeClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { formattedNumbers } from '../../../utils/formattedNumbers';

interface AccountBoxProps {
  accountName: string;
  balance: number;
  isVisible: boolean;
  onClick: () => void;
}

const AccountBox: React.FC<AccountBoxProps> = ({ accountName, balance, isVisible, onClick }) => {
    return (
        <div
          className="relative w-[28rem] h-22 bg-personalizedPink border-4 border-black rounded-2xl flex items-center justify-between text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={onClick}
        >
          <div className="flex items-center justify-start w-1/3">
            <p className="text-xl font-bold text-black truncate">{accountName}</p>
          </div>
    
          <div className="flex items-center justify-center w-1/3">
            {isVisible ? (
              <EyeIcon className="text-black" />
            ) : (
              <EyeClosedIcon className="text-black" />
            )}
          </div>
    
          <div className="flex items-center justify-end w-1/3">
            <span className="text-xl font-bold text-black">{formattedNumbers(balance)} €</span>
          </div>
        </div>
      );
};

export default AccountBox;