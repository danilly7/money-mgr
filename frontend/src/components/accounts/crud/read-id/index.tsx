import React from 'react';
import { useParams } from 'react-router-dom';
import { useAccounts } from '../../../../context/accounts-context';

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts, loading } = useAccounts();
  
  const account = accounts.find(acc => acc.id_account === Number(accountId));

  if (!account) {
    return <div className="text-center text-xl font-semibold">Account not found</div>;
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
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