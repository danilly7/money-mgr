import { useState } from "react";

import AmountBox from "../../components/ui/amount-box";
import { CheckButton } from "../../components/ui/check-btn";

import { EditButton } from "../../components/ui/edit-btn";
import { CancelButton } from "../../components/ui/cancel-btn";

import { DescriptionBox } from "../../components/ui/description-box";

import NameBox from "../../components/ui/name-box";
// import AccountBox from "../../components/ui/account-box";
import { VisibilityToggleButton } from "../../components/ui/visibility-toggle";


const Accounts = () => {
    
    const [amount, setAmount] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"cancel" | "submit" | null>(null); // <-- Se añadió este estado
    const [description, setDescription] = useState<string>("");
    const [isVisible, setIsVisible] = useState(true);

    const handleAmountChange = (newAmount: number) => {
        setAmount(newAmount);
    };

    const handleSubmit = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = (type: "cancel" | "submit") => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setDescription(newDescription);
    };

    const handleNameChange = (newName: string) => {
        setName(newName); // Aquí actualizas el estado con el nuevo nombre
    };

    // const [accounts, setAccounts] = useState([
    //     { name: 'Mainnnnnnnnnnnnnnnnnnnnnn', balance: 125024.55, isVisible: true },
    //     { name: 'Savings', balance: 5000.00, isVisible: false },
    //     { name: 'Expenses', balance: 230.75, isVisible: true },
    // ]);

    // const navigate = useNavigate(); 
    // const handleAccountClick = (accountId: string) => {
    //     navigate(`/account/${accountId}`);  // Redirigir al detalle de la cuenta
    // };

    return (
        <div>
            <div className="flex flex-col items-center justify-center pt-6">
                <h1 className="text-4xl font-bold">ACCOUNTS</h1>
            </div>
            
            

            <CheckButton onClick={() => handleOpenModal("submit")} />
            <CancelButton onClick={() => handleOpenModal("cancel")} />

            
            <EditButton to="/editdetails" />
            

            <VisibilityToggleButton
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />

            <AmountBox initialAmount={amount} onAmountChange={handleAmountChange} />
            <NameBox initialName={name} onNameChange={handleNameChange} />
            <DescriptionBox initialDescription={description} onDescriptionChange={handleDescriptionChange} />
           

            {/* <div className="flex flex-col items-center justify-center py-4 m-4 space-y-4"> */}
            {/* {accounts.map((account) => (
                    <AccountBox
                        key={account.id}
                        accountName={account.name}
                        balance={account.balance}
                        isVisible={account.isVisible}
                        onClick={() => handleAccountClick(account.id)}  // Enviar el id
                    />
                ))}
            </div> */}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        {modalType === "cancel" ? (
                            <>
                                <h2>Are you sure you want to cancel?</h2>
                                <button onClick={handleCloseModal} className="bg-red-500 text-white px-4 py-2 rounded">
                                    No, go back
                                </button>
                            </>
                        ) : (
                            <>
                                <h2>Are you sure you want to submit?</h2>
                                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                                    Yes, Submit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;