import React from "react";
import { EyeClosedIcon } from '../icons/EyeClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  className?: string;
}

export const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({ isVisible, toggleVisibility, className = '' }) => {
  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className={`w-5 h-5 flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none ${className}`}
      aria-label={isVisible ? "Hide password" : "Show password"}
      title={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? <EyeIcon className="text-black w-5 h-5" /> : <EyeClosedIcon className="text-black w-5 h-5" />}
    </button>
  );
};