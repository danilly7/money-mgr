import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../icons/SearchIcon";

export const SearchButton = ({
  to,
  className = "",
  timeframe,
  isExpense,
}: {
  to: string;
  className?: string;
  timeframe: "Day" | "Week" | "Month" | "Year";
  isExpense: boolean;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${to}?timeframe=${timeframe}&isExpense=${isExpense}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-14 h-14 bg-amber-300 text-black font-extrabold border-4 border-black text-2xl 
                        hover:bg-[#FFC300] rounded-full flex items-center justify-center 
                        transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${className}`}
      aria-label="Search"
    >
      <SearchIcon />
    </button>
  );
};