import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAccount } from '../../../../hooks/useFetchAccount';
import { EyeClosedIcon } from '../../../ui/icons/EyeClosedIcon';
import { EyeIcon } from '../../../ui/icons/EyeIcon';
import { EditModalButton } from '../../../ui/edit-modal-btn';
import { AccountEditModal } from '../update-modal';

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account, loading, error } = useFetchAccount(Number(accountId!));

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error.message}</div>;
  }

  if (!account) {
    return <div className="text-center text-xl font-semibold">Account not found</div>;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">Name:</p>
          <p className="text-lg">{account.name}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Visibility:</p>
          <p className="text-lg">{account.visibility ? <EyeIcon /> : <EyeClosedIcon />}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Balance:</p>
          <p className="text-lg">{account.balance} €</p>
        </div>
      </div>
      <div className="flex flex-row justify-center space-x-10 m-6">
        <EditModalButton onClick={handleOpenModal} />
        {/* <CancelButton onClick={() => window.history.back()} /> */}
      </div>

      <AccountEditModal isOpen={isModalOpen} onClose={handleCloseModal} accountId={Number(accountId!)} />
    </>
  );
};

export default AccountDetails;
