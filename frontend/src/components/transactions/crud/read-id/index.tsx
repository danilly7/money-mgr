import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchTransaction } from "../../../../hooks/useFetchTransaction";
import { CancelButton } from "../../../ui/cancel-btn";
import { formattedDate } from "../../../../utils/formattedDate";

const TransactionDetails: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, loading, error } = useFetchTransaction(Number(transactionId!));
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error.message}</div>;
  }

  if (!transaction) {
    return <div className="text-center text-xl font-semibold">Transaction not found</div>;
  }

  return (
    <div className="relative bg-white p-4 border-4 border-black rounded-lg shadow-lg my-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Amount:</p>
        <p className="text-lg">{transaction.amount} €</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Comment:</p>
        <p className="text-lg">{transaction.comment || "No comment"}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Category:</p>
        <p className="text-lg">{transaction.category?.name || "No category"}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Type:</p>
        <p className="text-lg capitalize">
          {transaction.category?.type === "income" ? "Income 💰" : "Expense 💸"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Account:</p>
        <p className="text-lg">{transaction.account?.name || "No account"}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Created:</p>
        <p className="text-lg">{formattedDate(new Date(transaction.createdAt))}</p>
      </div>
      {transaction.updatedAt !== transaction.createdAt && (
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Updated:</p>
          <p className="text-lg">{formattedDate(new Date(transaction.updatedAt))}</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <CancelButton onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default TransactionDetails;