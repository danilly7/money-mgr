import React, { useState, useEffect } from 'react';

interface CommentBoxProps {
  initialComment: string;
  onCommentChange: (comment: string) => void;
}

export const CommentBox: React.FC<CommentBoxProps> = ({ initialComment, onCommentChange }) => {
  const [comment, setComment] = useState<string>(initialComment);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onCommentChange(comment);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); //evita el salto de línea al presionar Enter
      handleBlur();
    }
  };

  return (
    <div className="flex items-start justify-center py-2">
      <div
        className="relative w-[28rem] h-36 bg-[#4ECDC4] border-4 border-black rounded-2xl flex items-start justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p
            className={`text-black text-xl font-bold transition-all duration-300 ${isEditing ? 'transform -translate-y-6 text-2xl' : ''}`}
          >
            Comment
          </p>

          {isEditing ? (
            <input
              type="text"
              value={comment}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-4xl font-bold text-center bg-transparent border-none outline-none"
              autoFocus
              placeholder="Blablabl"
              inputMode="text"
            />
          ) : (
            <span className="text-4xl font-bold mt-3 text-center">{comment}</span>
          )}

          {!isEditing && comment === "" && <div className="w-[calc(100%+7rem)] border-b-4 border-black mt-8" />}
        </div>
      </div>
    </div>
  );
};