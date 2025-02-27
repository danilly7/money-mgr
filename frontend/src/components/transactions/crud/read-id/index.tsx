import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchTransaction } from '../../../../hooks/useFetchTransaction';
import { CancelButton } from '../../../ui/cancel-btn';

const TransactionDetails: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, loading, error } = useFetchTransaction(Number(transactionId!));

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error.message}</div>;
  }

  if (!transaction || transaction.length === 0) {
    return <div className="text-center text-xl font-semibold">Transaction not found</div>;
  }

  const { amount, comment,  } = transaction[0];

  return (
    <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Amount:</p>
        <p className="text-lg">{amount} €</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Comment:</p>
        <p className="text-lg">{comment || 'No comment'}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">Category:</p>
        {/* <p className="text-lg">{category?.name || 'No category'}</p> */}
      </div>

      <div className="flex justify-center m-6">
        <CancelButton onClick={() => window.history.back()} />
      </div>
    </div>
  );
};

export default TransactionDetails;
