import { BackButton } from "../../../components/ui/back-btn";
import TransactionDetails from "../../../components/transactions/crud/read-id";

const DetailsTransactionId = () => {
    return (
        <>
            <BackButton />
            <div className="flex flex-col items-center justify-center pt-6 pb-1">
                <h1 className="text-4xl font-bold text-center whitespace-pre-line">
                    Transaction's
                    {"\n"}Details
                </h1>
            </div>
            <div className="p-4">
                <TransactionDetails />
            </div>
        </>
    );
};

export default DetailsTransactionId;