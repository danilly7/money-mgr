import React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick }) => {
  return (
    <div className="p-4 w-[80%] flex justify-center">
      <button
        onClick={onClick}
        className="w-full max-w-[200px] px-4 py-2 bg-personalizedGreen text-white text-xl font-bold rounded-lg transition-all duration-300 overflow-hidden hover:bg-[#4CAF84] hover:scale-105 hover:shadow-md cursor-pointer"
      >
        Load More
      </button>
    </div>
  );
};