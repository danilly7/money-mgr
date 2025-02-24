import React, { useState, useEffect } from 'react';
import { useFetchAccount } from '../../../../hooks/useFetchAccount';
import { useUpdateAccount } from '../../../../hooks/useUpdateAccount';
import { EyeClosedIcon } from '../../../ui/icons/EyeClosedIcon';
import { EyeIcon } from '../../../ui/icons/EyeIcon';
import { CheckButton } from '../../../ui/check-btn';
import { CancelButton } from '../../../ui/cancel-btn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number;
}

const AccountEditModal: React.FC<ModalProps> = ({ isOpen, onClose, accountId }) => {
  const { account, loading, error } = useFetchAccount(accountId);
  const { updateAccount } = useUpdateAccount();

  const [name, setName] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance);
      setIsVisible(account.visibility);
    }
  }, [account]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage('Account Name is required.');
      return;
    }

    setLoadingUpdate(true);
    setErrorMessage(null);

    const updatedAccount = {
      name,
      balance,
      visibility: isVisible,
      user_id: account!.user_id,
    };

    try {
      await updateAccount(accountId, updatedAccount);
      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update account.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleClose = () => {
    setName('');
    setBalance(0);
    setIsVisible(true);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 border-4 border-black rounded-lg shadow-lg max-w-lg w-full">
          <div>Loading account details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 border-4 border-black rounded-lg shadow-lg max-w-lg w-full">
          <div className="text-red-500">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 border-4 border-black rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="account-name" className="text-lg font-semibold">
            Account Name
          </label>
          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-md"
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="account-balance" className="text-lg font-semibold">
            Balance
          </label>
          <input
            id="account-balance"
            type="number"
            value={balance}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) setBalance(value);
            }}
            className="w-full p-2 border-2 border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold">Visibility</label>
          <button onClick={() => setIsVisible(!isVisible)} className="text-lg">
            {isVisible ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        <div className="flex justify-center gap-8">
          {loadingUpdate ? (
            <p>Updating account...</p>
          ) : (
            <>
              <CheckButton onClick={handleSubmit} />
              <CancelButton onClick={handleClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { AccountEditModal };