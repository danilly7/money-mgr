import { useNavigate } from "react-router-dom";
import { PlusIcon } from "../icons/PlusIcon";

export const PlusButton = ({ to, className = "" }: { to: string; className?: string }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-14 h-14 bg-personalizedPink text-black font-extrabold border-4 border-black text-2xl 
            hover:bg-[#4ECDC4] rounded-full flex items-center justify-center transition-all duration-300 
            hover:-translate-y-1 hover:scale-105 ${className}`}
            aria-label="Add"
        >
            <PlusIcon />
        </button>
    );
};