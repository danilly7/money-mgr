import React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick }) => {
  return (
    <div className="p-4 w-[80%] flex justify-center">
      <button
        onClick={onClick}
        className="w-full max-w-[300px] px-4 py-2 bg-personalizedGreen text-black text-xl font-bold border-4 border-black rounded-2xl transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-md cursor-pointer"
      >
        Load More
      </button>
    </div>
  );
};