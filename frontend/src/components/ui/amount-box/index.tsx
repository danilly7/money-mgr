import React, { useState, useEffect } from 'react';
import { formattedNumbers } from '../../../utils/formattedNumbers';

interface AmountBoxProps {
  initialAmount: number;
  onAmountChange: (amount: number) => void;
}

const AmountBox: React.FC<AmountBoxProps> = ({ initialAmount, onAmountChange }) => {
  const [amount, setAmount] = useState<string>(formattedNumbers(initialAmount));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //cuando el valor inicial cambie, actualizamos el estado
  useEffect(() => {
    setAmount(formattedNumbers(initialAmount));
  }, [initialAmount]);

  const handleClick = () => {
    setIsEditing(true);
    setAmount(''); //vacía el campo así no tienes que ir borrando todo el rato
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (amount.trim() === '') {
      setAmount(formattedNumbers(initialAmount)); //si el campo está vacío, restauramos el valor inicial
      onAmountChange(initialAmount);
    } else if (!isNaN(parsedAmount)) {
      onAmountChange(parsedAmount);
      setAmount(formattedNumbers(parsedAmount));
    } else {
      setAmount(formattedNumbers(initialAmount));
      onAmountChange(initialAmount);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) { //esto hace tmb que no haya núms negativos!
      setAmount(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex items-start justify-center py-2 m-4">
      <div
        className="relative w-[28rem] h-40 bg-[#4ECDC4] border-4 border-black rounded-2xl flex items-center justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-xl font-bold">Amount</p>
          {isEditing ? (
            <input
              type="text"
              value={amount}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown} //para guardar al hacer Enter
              className="text-7xl font-bold mt-3 text-center bg-transparent border-none outline-none"
              autoFocus
              inputMode="decimal"
            />
          ) : (
            <span className="text-5xl sm:text-6xl font-bold mt-3">
              {amount} <span className="text-black">€</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmountBox;