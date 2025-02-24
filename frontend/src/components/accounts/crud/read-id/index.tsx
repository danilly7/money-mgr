import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAccount } from '../../../../hooks/useFetchAccount';

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account, loading, error } = useFetchAccount(accountId!);

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error.message}</div>;
  }

  if (!account) {
    return <div className="text-center text-xl font-semibold">Account not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold">Account Details</h1>
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">Name:</p>
          <p className="text-lg">{account.name}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Visibility:</p>
          <p className="text-lg">{account.visibility ? 'Visible' : 'Hidden'}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Balance:</p>
          <p className="text-lg">{account.balance} €</p>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;