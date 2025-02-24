import { useState, useEffect, useRef } from "react";
import AmountBox from "../../../ui/amount-box";
import NameBox from "../../../ui/name-box";
import { VisibilityToggleButton } from "../../../ui/visibility-toggle";
import { CheckButton } from "../../../ui/check-btn";
import { CancelButton } from "../../../ui/cancel-btn";
import { ModalMisc } from "../../../modal";
import { useFetchAccount } from "../../../../hooks/useFetchAccount";
import { useUpdateAccount } from "../../../../hooks/useUpdateAccount";

interface AccountEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number;
}

const AccountEditModal = ({ isOpen, onClose, accountId }: AccountEditModalProps) => {
  const { account, loading, error, refetch } = useFetchAccount(accountId);
  const { updateAccount } = useUpdateAccount();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
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
    if (account) {
      setName(account.name);
      setBalance(account.balance);
      setIsVisible(account.visibility);
    }
  }, [account]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage("Account Name is required.");
      return;
    }

    if (balance < 0) {
      setErrorMessage("Balance cannot be negative.");
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
      setModalMessage("Account updated successfully!");
      setIsModalOpen(true);
      refetch();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update account.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleCancel = () => {
    setModalMessage("Account update has been cancelled.");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  if (loading) {
    return <p>Loading account details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <div className="relative bg-white p-3 border-4 border-black rounded-lg shadow-lg my-4 overflow-hidden max-w-lg mx-auto">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        <div className="flex flex-col">
          {errorMessage && (
            <p ref={errorRef} className="text-red-500 text-md font-semibold">
              {errorMessage}
            </p>
          )}
          <p className="text-md text-gray-500 mb-1">Account Name: Update it with a new name.</p>
          <NameBox initialName={name} onNameChange={setName} />
        </div>

        <div className="flex flex-col">
          <p className="text-md text-gray-500 mb-1">Balance: Update it with a different amount.</p>
          <AmountBox initialAmount={balance} onAmountChange={setBalance} />
        </div>

        <div className="flex flex-col items-center mb-4">
          <p className="text-md text-gray-500 mb-1">
            Account Visibility: Change it to make it or not visible in the total balance.
          </p>
          <VisibilityToggleButton
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            className="mt-3"
          />
        </div>

        <div className="border-t-4 border-black my-2 w-full" />

        <div className="flex justify-center gap-8 mb-4">
          {loadingUpdate ? (
            <p>Updating account...</p>
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

export { AccountEditModal };