import React from 'react';

interface ErrorBoxProps {
  message: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
  return (
    <div className="flex items-start justify-center pt-20"> {/* Ajuste en Y con pt-20 */}
      <div className="relative inline-block border-4 border-black rounded-lg bg-red-500 text-white p-8 transition-all duration-300">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">Error</span>
          <p className="text-lg sm:text-xl lg:text-2xl mt-4">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBox;