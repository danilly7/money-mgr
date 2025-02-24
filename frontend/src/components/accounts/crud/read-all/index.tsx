import React, {useEffect} from 'react';
import { EyeClosedIcon } from '../../../ui/icons/EyeClosedIcon';
import { EyeIcon } from '../../../ui/icons/EyeIcon';
import { formattedNumbers } from '../../../../utils/formattedNumbers';
import { useAccounts } from '../../../../context/accounts-context';
import { useNavigate, useLocation } from 'react-router-dom';

const AccountsList: React.FC = () => {
  const { accounts, loading, refetchAccounts } = useAccounts();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    refetchAccounts();
  }, [location.pathname, refetchAccounts]); 

  const handleAccountClick = (accountId: number) => {
    if (accountId) {
      navigate(`/accounts/acc/${accountId}`);
    } else {
      console.log("Error: accountId is undefined", accountId);
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  return (
    <>
      <div className="relative max-w-lg mx-auto h-22 bg-personalizedPink border-4 border-black rounded-2xl flex items-center text-black p-4 mb-2">
        <div className="flex items-center justify-start w-1/3">
          <p className="text-xl font-bold text-black">Account</p>
        </div>

        <div className="flex items-center justify-center w-1/3">
          <p className="text-xl font-bold text-black">Visibility</p>
        </div>

        <div className="flex items-center justify-end w-1/3">
          <p className="text-xl font-bold text-black">Amount</p>
        </div>
      </div>

      {accounts.map((account, index) => {
        return (
          <div
            key={account.id ?? account.name ?? `account-${index}`}
            className="relative max-w-lg mx-auto h-22 bg-slate-300 border-4 border-black rounded-2xl flex items-center text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer mb-2"
            onClick={() => handleAccountClick(Number(account.id))}
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
        );
      })}
    </>
  );
};

export default AccountsList;