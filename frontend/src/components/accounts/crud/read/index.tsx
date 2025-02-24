import React from 'react';
import { EyeClosedIcon } from '../../../ui/icons/EyeClosedIcon';
import { EyeIcon } from '../../../ui/icons/EyeIcon';
import { formattedNumbers } from '../../../../utils/formattedNumbers';
import { useAccounts } from '../../../../context/accounts-context';
import { useNavigate } from 'react-router-dom';

const AccountsList: React.FC = () => {
  const { accounts, loading } = useAccounts();
  const navigate = useNavigate();

  const handleAccountClick = (accountId: number) => {
    navigate(`/account/${accountId}`);
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  return (
    <>
      {accounts.map(account => (
        <div
          key={account.id_account}
          className="relative max-w-lg mx-auto h-22 bg-slate-300 border-4 border-black rounded-2xl flex items-center text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer mb-2"
          onClick={() => handleAccountClick(account.id_account as number)}
        >
          <div className="flex items-center justify-start w-1/3">
            <p className="text-xl font-bold text-black truncate">{account.name}</p>
          </div>

          <div className="flex items-center justify-center w-1/3">
            {account.visibility ? (
              <EyeIcon className="text-black" />
            ) : (
              <EyeClosedIcon className="text-black" />
            )}
          </div>

          <div className="flex items-center justify-end w-1/3">
            <span className="text-xl font-bold text-black">
              {formattedNumbers(account.balance)} €
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default AccountsList;