import React, { useState, useEffect } from 'react';

interface NameBoxProps {
    initialName: string;
    onNameChange: (name: string) => void;
}

const NameBox: React.FC<NameBoxProps> = ({ initialName, onNameChange }) => {
    const [name, setName] = useState<string>(initialName);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onNameChange(name);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); //para que no haga el salto de linea ya que es un Enter
            handleBlur();
        }
    };

    return (
        <div className="flex items-start justify-center py-2 m-4">
            <div
                className="relative w-[28rem] h-36 bg-[#4ECDC4] border-4 border-black rounded-2xl flex items-start justify-center text-black p-8 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={handleClick}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <p
                        className={`text-black text-xl font-bold transition-all duration-300 ${isEditing ? 'transform -translate-y-6 text-2xl' : ''}`}
                    >
                        Name
                    </p>

                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="text-4xl font-bold text-center bg-transparent border-none outline-none"
                            autoFocus
                            placeholder="You name it"
                            inputMode="text"
                        />
                    ) : (
                        <span className="text-4xl font-bold mt-3 text-center">{name}</span>
                    )}

                    {!isEditing && name === "" && <div className="w-[calc(100%+10rem)] border-b-4 border-black mt-8" />}
                </div>
            </div>
        </div>
    );
};

export default NameBox;