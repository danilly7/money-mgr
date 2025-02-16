import { FC } from "react";

interface SwitchTimeframeProps {
  timeframe: "Day" | "Week" | "Month" | "Year";
  setTimeframe: (value: "Day" | "Week" | "Month" | "Year") => void;
}

const SwitchTimeframe: FC<SwitchTimeframeProps> = ({ timeframe, setTimeframe }) => {

  const options = [
    { label: "Day", color: "bg-personalizedGreen" },
    { label: "Week", color: "bg-personalizedOrange" },
    { label: "Month", color: "bg-personalizedPurple" },
    { label: "Year", color: "bg-personalizedPink" },
  ];

  return (
    <div className="flex items-center justify-center py-4 m-4">
      <div className="relative w-[28rem] h-16 bg-transparent border-4 border-black rounded-2xl flex overflow-hidden">
        {options.map(({ label, color }) => (
          <button
            key={label}
            className={`h-full flex-1 flex items-center justify-center text-2xl transition-all duration-300 px-4 
              ${timeframe === label ? `${color} text-black font-semibold` : "bg-gray-800 text-gray-200"} 
              ${label === "Day" ? "rounded-l-xl" : ""} 
              ${label === "Year" ? "rounded-r-xl" : ""}`}
            onClick={() => setTimeframe(label as "Day" | "Week" | "Month" | "Year")}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SwitchTimeframe;