import { useEffect, useRef, useState } from "react";
import AmountBox from "../../../ui/amount-box";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { ModalMisc } from "../../../modal misc";
import { CommentBox } from "../../../ui/comment-box";
import { DateBox } from "../../../ui/date-box";
import { CategorySelector } from "../../../ui/category-selector";
import { AccountSelector } from "../../../ui/account-selector";
import { useFetchTransaction } from "../../../../hooks/useFetchTransaction";
import { useUpdateTransaction } from "../../../../hooks/useUpdateTransaction";
import { TransactionUpdate } from "../../interface-transaction";

interface TransactionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number;
}

export const TransactionEditModal = ({
    isOpen,
    onClose,
    transactionId,
}: TransactionEditModalProps) => {
    const { transaction, loading, error, refetch } = useFetchTransaction(transactionId);
    const { updateTransaction } = useUpdateTransaction();

    const [amount, setAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [accountId, setAccountId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryType, setCategoryType] = useState<"income" | "expense">("expense");

    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const errorRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (errorMessage && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [errorMessage]);

    useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setComment(transaction.comment || "");
      setDate(new Date(transaction.createdAt));
      setAccountId(transaction.account?.id || null);
      setCategoryId(transaction.category?.id_category || null);
      setCategoryType(transaction.category?.type || "expense");
      setErrorMessage(null);
    }
  }, [transaction]);

    const handleSubmit = async () => {
        if (amount <= 0) {
            setErrorMessage("Amount must be greater than 00000.");
            return;
        }

        if (categoryId === null) {
            setErrorMessage("Category is required.");
            return;
        }

        if (accountId === null) {
            setErrorMessage("Account is required.");
            return;
        }
        
        setLoadingUpdate(true);
        setErrorMessage(null);
        
        const updatedTransaction:TransactionUpdate = {
            amount,
            comment,
            date,
            category_id: categoryId!,
            account_id: accountId!,
        };
        
        try {
            await updateTransaction(transactionId, updatedTransaction);
            setModalMessage("Transaction updated successfully!");
            setIsModalOpen(true);
            refetch();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Failed to update transaction.");
        } finally {
            setLoadingUpdate(false);
        }
        console.log({ amount, categoryId, accountId });
    };

    const handleCancel = () => {
        onClose();
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        onClose();
    };

    if (!isOpen) return null;
    if (loading) return <p>Loading transaction...</p>;
    if (error) return <p className="text-red-500">{error.message}</p>;

    return (
        <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 max-w-lg mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                {errorMessage && (
                    <p ref={errorRef} className="text-red-500 text-md font-semibold">
                        {errorMessage}
                    </p>
                )}

                <AccountSelector selectedAccountId={accountId} onAccountChange={setAccountId} />
                <AmountBox initialAmount={amount} onAmountChange={setAmount} />
                <CategorySelector
                    selectedCategoryId={categoryId}
                    onCategoryChange={setCategoryId}
                    type={categoryType}
                />
                <CommentBox initialComment={comment} onCommentChange={setComment} />
                <DateBox initialDate={date} onDateChange={setDate} />

                <div className="flex justify-center gap-8 mt-4">
                    {loadingUpdate ? (
                        <p>Updating transaction...</p>
                    ) : (
                        <>
                            <CheckButton onClick={handleSubmit} disabled={loadingUpdate} />
                            <CancelButton onClick={handleCancel} />
                        </>
                    )}
                </div>
            </form>

            <ModalMisc isOpen={isModalOpen} onClose={handleModalClose} message={modalMessage} />
        </div>
    );
};