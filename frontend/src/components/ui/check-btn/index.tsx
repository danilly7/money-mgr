import { CheckIcon } from "../icons/CheckIcon";

interface CheckButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const CheckButton = ({ onClick, className = "", disabled = false }: CheckButtonProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`w-14 h-14 bg-personalizedGreen text-black font-extrabold border-4 border-black text-2xl hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      aria-label="Submit"
      disabled={disabled}
    >
      <CheckIcon />
    </button>
  );
};