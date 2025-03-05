import { useState, useRef, useEffect } from "react";
import AmountBox from "../../../ui/amount-box";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { useAuth } from "../../../../context/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalMisc } from "../../../modal misc";
import { useAddTransaction } from "../../../../hooks/useAddTransaction";
import SwitchExpenseIncome from "../../../ui/switch-expense-income";
import { CommentBox } from "../../../ui/comment-box";
import { DateBox } from "../../../ui/date-box";
import { CategorySelector } from "../../../ui/category-selector";
import { AccountSelector } from "../../../ui/account-selector";
import { useFetchAccount } from "../../../../hooks/useFetchAccount";

const NewTransactionForm = () => {
    const { addTransaction } = useAddTransaction();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const initialIsExpense = queryParams.get("isExpense") === "true";

    const [amount, setAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [accountId, setAccountId] = useState<number | null>(null);
    const [isExpense, setIsExpense] = useState<boolean>(initialIsExpense);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const errorRef = useRef<HTMLParagraphElement>(null);

    const { account } = useFetchAccount(accountId || 0);

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
            if (isExpense && account && amount > account.balance) {
                setErrorMessage("Sorry, not enough money in this account. Try a different one.");
                return;
            }

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
        navigate(`/transactions?timeframe=Month&isExpense=${isExpense}`);
    };

    return (
        <div className={`relative bg-white p-3 border-4 rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto 
            ${isExpense ? 'border-personalizedPink' : 'border-personalizedGreen'}`}
        >
            <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                {errorMessage && (
                    <p ref={errorRef} className="text-red-500 text-md font-semibold my-2 flex justify-center">
                        {errorMessage}
                    </p>
                )}

                <div className="flex flex-col mt-2">
                    <AccountSelector
                        selectedAccountId={accountId}
                        onAccountChange={setAccountId}
                    />
                </div>

                <div className="flex flex-col mt-2">
                    <AmountBox initialAmount={amount} onAmountChange={setAmount} />
                </div>

                <div className="flex flex-col mt-2">
                    <CategorySelector
                        selectedCategoryId={categoryId}
                        onCategoryChange={setCategoryId}
                        type={isExpense ? "expense" : "income"}
                    />
                </div>

                <div className="flex flex-col mt-2">
                    <CommentBox initialComment={comment} onCommentChange={setComment} />
                </div>

                <div className="flex flex-col mt-2">
                    <DateBox initialDate={date} onDateChange={(newDate: Date) => setDate(newDate)} />
                </div>

                <div className="flex justify-center gap-8 my-4">
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