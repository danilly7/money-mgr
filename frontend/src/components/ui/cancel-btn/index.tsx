import { CancelIcon } from "../icons/CancelIcon";

export const CancelButton = ({ onClick, className = "" }: { onClick?: () => void; className?: string }) => {
    return (
        <button
            onClick={onClick}
            className={`w-14 h-14 bg-[#FF6B6B] text-black font-extrabold border-4 border-black text-2xl 
                        hover:bg-red-500 rounded-full flex items-center justify-center 
                        transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${className}`}
            aria-label="Cancel"
        >
            <CancelIcon />
        </button>
    );
};