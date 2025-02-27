import { BackButton } from "../../../components/ui/back-btn";
import NewTransactionForm from "../../../components/transactions/crud/create";

const NewTransaction = () => {
    return (
        <>
            <BackButton />
            <div className="flex flex-col items-center justify-center pt-6 pb-1">
                <h1 className="text-4xl font-bold text-center whitespace-pre-line">
                    New
                    {"\n"}Transaction
                </h1>
            </div>
            <div className="p-4">
                <NewTransactionForm />
            </div>
        </>
    );
};

export default NewTransaction;