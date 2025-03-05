import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "../icons/PlusIcon";

interface AddButtonProps {
  to: string;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ to, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div className={`w-[80%] flex justify-center ${className}`}>
      <button
        onClick={handleClick}
        className="w-full max-w-[60px] h-[60px] bg-personalizedPink text-black font-extrabold border-4 border-black text-2xl flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
        aria-label="Add"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default AddButton;