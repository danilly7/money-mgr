import React, { useState, useEffect } from "react";
import { formattedDate } from "../../../utils/formattedDate";

interface DateBoxProps {
  initialDate: string;
  onDateChange: (date: string) => void;
}

export const DateBox: React.FC<DateBoxProps> = ({ initialDate, onDateChange }) => {
  const [date, setDate] = useState<string>(initialDate);
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
    const selectedDate = event.target.value;
    if (selectedDate > today) return; //no se puede escribir en fecha futura
    setDate(selectedDate);
  };

  return (
    <div className="flex items-start justify-center py-2">
      <div
        className="relative w-[28rem] h-36 bg-[#4ECDC4] border-4 border-black rounded-2xl flex items-start justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className={`text-black text-xl font-bold transition-all duration-300 ${isEditing ? 'transform -translate-y-6 text-2xl' : ''}`}>
            Date
          </p>
          {isEditing ? (
            <input
              type="date"
              value={date}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-4xl font-bold text-center bg-transparent border-none outline-none"
              autoFocus
              max={today}
            />
          ) : (
            <span className="text-4xl font-bold mt-3 text-center">{formattedDate(new Date(date))}</span> // Mostrar la fecha formateada
          )}
          {!isEditing && date === "" && <div className="w-[calc(100%+7rem)] border-b-4 border-black mt-8" />}
        </div>
      </div>
    </div>
  );
};