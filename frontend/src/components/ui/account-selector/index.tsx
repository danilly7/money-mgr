import React, { useState, useEffect, useRef } from "react";
import useFetchAllAccounts from "../../../hooks/useFetchAllAccounts";
import { Account } from "../../accounts/interface-account";
import { useNavigate } from "react-router-dom";

interface AccountSelectorProps {
    selectedAccountId: number | null;
    onAccountChange: (accountId: number) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
    selectedAccountId,
    onAccountChange,
}) => {
    const { accounts, loading, error } = useFetchAllAccounts();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const accountSelectorRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const account = accounts.find((a) => a.id === selectedAccountId) || null;
        setSelectedAccount(account);
    }, [selectedAccountId, accounts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountSelectorRef.current && !accountSelectorRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        setIsEditing((prev) => !prev);
    };

    const handleAccountSelect = (account: Account) => {
        setSelectedAccount(account);
        onAccountChange(account.id!);
        setIsEditing(false);
    };

    const handleCreateAccount = () => {
        navigate('/accounts');
    };

    return (
        <div className="relative flex flex-col items-center" ref={accountSelectorRef}>
            <button
                className="w-full sm:w-[28rem] h-20 bg-[#4ECDC4] border-4 border-black rounded-2xl text-black font-bold text-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden"
                onClick={handleClick}
            >
                {selectedAccount ? (
                    <span className="text-black text-2xl">{selectedAccount.name}</span>
                ) : (
                    <span className="text-xl text-gray-400">Choose an account</span>
                )}
            </button>

            {isEditing && (
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-full sm:w-56 bg-white border-4 border-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {loading ? (
                        <p className="text-center p-4">Loading accounts...</p>
                    ) : error ? (
                        <p className="text-center p-4 text-red-500">Error loading accounts.</p>
                    ) : accounts.length > 0 ? (
                        accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center gap-4 p-3 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleAccountSelect(account)}
                            >
                                <span className="text-lg font-semibold">{account.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center p-4">
                            <p className="text-center mb-4">No accounts found.</p>
                            <button
                                className="bg-personalizedPink font-bold text-white px-4 py-2 rounded-lg hover:bg-personalizedPinkDark transition-colors"
                                onClick={handleCreateAccount}
                            >
                                Create a new account
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};