import React, { useState, useEffect } from "react";
import { formattedDate } from "../../../utils/formattedDate";

interface DateBoxProps {
  initialDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateBox: React.FC<DateBoxProps> = ({ initialDate, onDateChange }) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onDateChange(date);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    if (selectedDate > new Date()) return; //no se puede seleccionar una fecha futura
    setDate(selectedDate);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <button
        className="w-[28rem] h-12 bg-[#4ECDC4] border-4 border-black rounded-lg text-black font-bold text-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
        onClick={handleClick}
      >
        {formattedDate(date)}
      </button>

      {isEditing && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-56 bg-white border-4 border-black rounded-lg shadow-lg p-2 z-20 flex justify-center">
          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={handleChange}
            onBlur={handleBlur}
            className="text-lg font-bold text-center bg-transparent border-none outline-none cursor-pointer"
            autoFocus
            max={today}
          />
        </div>
      )}
    </div>
  );
};