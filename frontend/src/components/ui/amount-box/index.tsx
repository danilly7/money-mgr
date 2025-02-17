import React, { useState, useEffect } from 'react';

interface AmountBoxProps {
  initialAmount: number;
  onAmountChange: (amount: number) => void;
}

const AmountBox: React.FC<AmountBoxProps> = ({ initialAmount, onAmountChange }) => {
  const [amount, setAmount] = useState<string>(initialAmount.toFixed(2));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //cuando el valor inicial cambie, actualizamos el estado
  useEffect(() => {
    setAmount(initialAmount.toFixed(2));
  }, [initialAmount]);

  const handleClick = () => {
    setIsEditing(true);
    setAmount(''); //vacía el campo así no tienes que ir borrando todo el rato
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedAmount = parseFloat(amount);

    if (amount.trim() === '') {
      setAmount(initialAmount.toFixed(2)); //si el campo está vacío, restauramos el valor inicial
      onAmountChange(initialAmount);
    } else if (!isNaN(parsedAmount)) {
      onAmountChange(parsedAmount);
    } else {
      setAmount(initialAmount.toFixed(2));
      onAmountChange(initialAmount);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="flex items-start justify-center py-4 m-4">
      <div
        className="relative w-[28rem] h-40 bg-personalizedOrange border-4 border-black rounded-2xl flex items-center justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black text-xl font-bold">Amount</p>
          {isEditing ? (
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-7xl font-bold mt-3 text-center bg-transparent border-none outline-none"
              autoFocus
              inputMode='decimal'
            />
          ) : (
            <span className="text-6xl sm:text-7xl font-bold mt-3">
              {amount} <span className="text-black">€</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmountBox;