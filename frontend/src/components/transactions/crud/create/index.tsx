import { useState, useRef, useEffect } from "react";
import AmountBox from "../../../ui/amount-box";
import NameBox from "../../../ui/name-box";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { useAuth } from "../../../../context/auth-context";
import { useNavigate } from "react-router-dom";
import { ModalMisc } from "../../../modal misc";
import { useAddTransaction } from "../../../../hooks/useAddTransaction";
import SwitchExpenseIncome from "../../../ui/switch-expense-income";
import { CommentBox } from "../../../ui/comment-box";
import { DateBox } from "../../../ui/date-box";
import { CategorySelector } from "../../../ui/category-selector";

const NewTransactionForm = () => {
    const { addTransaction } = useAddTransaction();
    const { userId } = useAuth();
    const navigate = useNavigate();

    const [amount, setAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [accountId, setAccountId] = useState<number | null>(null);
    const [isExpense, setIsExpense] = useState<boolean>(true);

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

        if (!amount || amount <= 0) {
            setErrorMessage("Amount must be greater than 0.");
            return;
        }

        if (!categoryId) {
            setErrorMessage("Category is required.");
            return;
        }

        if (!accountId) {
            setErrorMessage("Account is required.");
            return;
        }

        if (!userId) {
            setErrorMessage("User not authenticated.");
            return;
        }

        setLoading(true);

        const newTransaction = {
            category_id: categoryId,
            account_id: accountId,
            amount,
            comment,
            date,
        };

        try {
            await addTransaction(newTransaction);
            setAmount(0);
            setComment("");
            setCategoryId(null);
            setAccountId(null);
            setModalMessage("Transaction created successfully!");
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
        setAmount(0);
        setComment("");
        setCategoryId(null);
        setAccountId(null);
        navigate(-1);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate("/transactions");
    };

    return (
        <div className={`relative bg-white p-3 border-4 rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto 
            ${isExpense ? 'border-personalizedPink' : 'border-personalizedGreen'}`}
        >
            <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                {errorMessage && (
                    <p ref={errorRef} className="text-red-500 text-md font-semibold">
                        {errorMessage}
                    </p>
                )}

                <div className="flex flex-col mt-2">
                    <AmountBox initialAmount={amount} onAmountChange={setAmount} />
                </div>

                <div className="flex flex-col">
                    <CategorySelector
                        selectedCategoryId={categoryId}
                        onCategoryChange={setCategoryId}
                        type={isExpense ? "expense" : "income"}
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-md text-gray-500 mb-1">Account:</p>
                    <NameBox initialName={accountId?.toString() || ""} onNameChange={(value) => setAccountId(Number(value))} />
                </div>

                <div className="flex flex-col">
                    <CommentBox initialComment={comment} onCommentChange={setComment} />
                </div>

                <div className="flex flex-col">
                    <DateBox initialDate={date} onDateChange={(newDate: Date) => setDate(newDate)} />
                </div>

                <div className="flex justify-center gap-8 mb-4">
                    {loading ? (
                        <p>Creating new transaction...</p>
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

export default NewTransactionForm;