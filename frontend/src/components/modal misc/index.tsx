import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export const ModalMisc: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-4 border-4 border-black rounded-lg shadow-lg w-80"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-center text-lg text-gray-700 mb-4">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-[#4ECDC4] text-black font-semibold border-4 border-black py-2 px-4 rounded-md"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};