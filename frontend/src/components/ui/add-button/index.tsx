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
    <button
      onClick={handleClick}
      className={`w-14 h-14 bg-personalizedPink text-black font-extrabold border-4 border-black text-2xl 
                  flex items-center justify-center rounded-full transition-all duration-300 
                  hover:scale-105 hover:shadow-md cursor-pointer ${className}`}
      aria-label="Add"
    >
      <PlusIcon />
    </button>
  );
};

export default AddButton;