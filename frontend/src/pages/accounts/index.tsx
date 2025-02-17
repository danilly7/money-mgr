import { useState } from "react";
import SwitchTimeframe from "../../components/ui/switch-time-frame";
import SwitchExpenseIncome from "../../components/ui/switch-expense-income";
import BalanceBox from "../../components/ui/balance-box";
import AmountBox from "../../components/ui/amount-box";
import { CheckButton } from "../../components/ui/check-btn";
import { PlusButton } from "../../components/ui/Plus-btn";
import { EditButton } from "../../components/ui/edit-btn";
import { CancelButton } from "../../components/ui/cancel-btn";
import { SearchButton } from "../../components/ui/search-btn";
import { DescriptionBox } from "../../components/ui/description-box";

const Accounts = () => {
    const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");
    const [isExpense, setIsExpense] = useState(true);
    const [amount, setAmount] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState<string>('');

    const handleAmountChange = (newAmount: number) => {
        setAmount(newAmount);  //actualiza el amount en el estado del componente padre
    };

    const handleSubmit = () => {
        console.log("Formulario enviado ✅");
        //aquí manejamos el envío del formulario (ej. llamar a una API)
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setDescription(newDescription);
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center pt-6">
                <h1 className="text-4xl font-bold">ACCOUNTS</h1>
            </div>
            <SwitchExpenseIncome isExpense={isExpense} setIsExpense={setIsExpense} />
            <SwitchTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
            <BalanceBox balance={150.50} />
            <CheckButton onClick={handleSubmit} />
            <PlusButton onClick={handleSubmit} />
            <EditButton to="/" />
            <CancelButton onClick={handleOpenModal} />
            <SearchButton to="/details" />
            <AmountBox initialAmount={amount} onAmountChange={handleAmountChange} />
            <DescriptionBox
                initialDescription={description}
                onDescriptionChange={handleDescriptionChange}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2>Are you sure you want to cancel?</h2>
                        <button onClick={handleCloseModal} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;