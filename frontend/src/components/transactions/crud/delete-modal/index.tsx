import { useState } from "react";
import { ModalMisc } from "../../../modal misc";
import { useNavigate } from "react-router-dom";

interface ConfirmationDeleteTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const ConfirmationDeleteTransactionModal: React.FC<ConfirmationDeleteTransactionModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            await onConfirm();
            setModalMessage("The transaction has been deleted permanently.");
            setIsModalOpen(true);
        } catch (error) {
            console.log(error);
            setModalMessage("Failed to delete the transaction.");
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate("/transactions");
    };

    return (
        <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Are you sure you want to delete this transaction?</h2>
            <p className="mb-4 text-gray-500 text-center">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-5 mb-2">
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg border-4 border-black transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:bg-gray-700"
                >
                    Cancel Action
                </button>

                <button
                    onClick={handleDelete}
                    className="bg-[#FF6B6B] text-black font-semibold px-4 py-2 rounded-lg border-4 border-black transition-all duration-300 transform hover:scale-100 hover:-translate-y-1 hover:bg-red-500"
                >
                    Delete Transaction
                </button>
            </div>

            <ModalMisc isOpen={isModalOpen} onClose={handleModalClose} message={modalMessage} />
        </div>
    );
};
