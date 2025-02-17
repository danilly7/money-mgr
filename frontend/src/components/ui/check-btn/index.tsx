import { CheckIcon } from "../icons/CheckIcon";

export const CheckButton = ({ onClick, className = "" }: { onClick: () => void; className?: string }) => {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 bg-personalizedPurple text-black font-extrabold border-4 border-black text-2xl hover:bg-personalizedGreen rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${className}`}
      //classname al final por si el padre quiere ponerle classnames, de esta manera los acepta
      aria-label="Submit"
    >
      <CheckIcon />
    </button>
  );
};