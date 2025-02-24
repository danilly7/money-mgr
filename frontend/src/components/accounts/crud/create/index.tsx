import { useState, useRef, useEffect } from "react";
import AmountBox from "../../../ui/amount-box";
import NameBox from "../../../ui/name-box";
import { VisibilityToggleButton } from "../../../ui/visibility-toggle";
import { useAccounts } from "../../../../context/accounts-context";
// import { useAuth } from "../../../../context/auth-context";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { useNavigate } from "react-router-dom";
import { ModalMisc } from "../../../modal";

const NewAccountForm = () => {
    const { addAccount } = useAccounts();
    // const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const errorRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (errorMessage && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [errorMessage]);

    const handleSubmit = async () => {
        setErrorMessage(null);

        if (!name.trim()) {
            setErrorMessage("Account Name is required.");
            return;
        }

        //validación números negativos no hace falta pq el mismo AmountBox lo hace solo.

        // if (!currentUser) {
        //     setErrorMessage("User not authenticated.");
        //     return;
        // }

        setLoading(true);

        const newAccount = {
            name,
            balance: amount,
            visibility: isVisible,
            // user_id: Number(currentUser.uid),
        };

        try {
            await addAccount(newAccount);
            setName("");
            setAmount(0);
            setIsVisible(true);
            setModalMessage("Account created successfully!");
            setIsModalOpen(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName("");
        setAmount(0);
        setIsVisible(true);
        setModalMessage("Account creation has been cancelled.");
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate("/accounts");  // Redirigir a /accounts solo cuando el modal se cierra
    };

    return (
        <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <p className="text-md text-gray-500 mb-1">
                        Account Name: Choose a unique name.
                    </p>
                    {errorMessage && (
                        <p ref={errorRef} className="text-red-500 text-md font-semibold">
                            {errorMessage}
                        </p>
                    )}
                    <NameBox initialName={name} onNameChange={setName} />
                </div>

                <div className="flex flex-col">
                    <p className="text-md text-gray-500 mb-1">
                        Balance: Initial balance of the account.
                    </p>
                    <AmountBox initialAmount={amount} onAmountChange={setAmount} />
                </div>

                <div className="flex flex-col items-center mb-4">
                    <p className="text-md text-gray-500 mb-1">
                        Account Visibility: Choose whether to make this account visible in the total balance or not.
                    </p>
                    <VisibilityToggleButton
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        className="mt-3"
                    />
                </div>

                <div className="border-t-4 border-black my-2 w-full" />

                <div className="flex justify-center gap-8 mb-4">
                    {loading ? (
                        <p>Creating new account...</p>
                    ) : (
                        <>
                            <CheckButton onClick={handleSubmit} />
                            <CancelButton onClick={handleCancel} />
                        </>
                    )}
                </div>
            </form>

            <ModalMisc
                isOpen={isModalOpen}
                onClose={handleModalClose}
                message={modalMessage}
            />
        </div>
    );
};

export default NewAccountForm;