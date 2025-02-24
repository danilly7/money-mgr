import { useState } from "react";
import AmountBox from "../../../ui/amount-box";
import NameBox from "../../../ui/name-box";
import { VisibilityToggleButton } from "../../../ui/visibility-toggle";
import { useAccounts } from "../../../../context/accounts-context";
import { useAuth } from "../../../../context/auth-context";
import Spinner from "../../../ui/spinner";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { useNavigate } from "react-router-dom";

const NewAccountForm = () => {
    const { addAccount } = useAccounts();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Account name is required.");
            return;
        }

        if (amount < 0) {
            alert("Balance cannot be negative.");
            return;
        }

        if (!currentUser) {
            alert("User not authenticated.");
            return;
        }

        setLoading(true);

        const newAccount = {
            name,
            balance: amount,
            visibility: isVisible,
            user_id: Number(currentUser.uid),
        };

        try {
            await addAccount(newAccount);
            setName("");
            setAmount(0);
            setIsVisible(true);
            navigate("/accounts");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error creating account:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName("");
        setAmount(0);
        setIsVisible(true);
        navigate(-1);
    };

    return (
        <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-1">
                        Account Name: Choose a unique name.
                    </p>
                    <NameBox initialName={name} onNameChange={setName} />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-1">
                        Balance: Initial balance of the account.
                    </p>
                    <AmountBox initialAmount={amount} onAmountChange={setAmount} />
                </div>

                <div className="flex flex-col items-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">
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
                        <Spinner />
                    ) : (
                        <>
                            <CheckButton onClick={handleSubmit} />
                            <CancelButton onClick={handleCancel} />
                        </>
                    )}
                </div>
            </form>
        </div>

    );
};

export default NewAccountForm;