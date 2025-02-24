import { BackButton } from "../../../components/ui/back-btn";
import AccountDetails from "../../../components/accounts/crud/read-id";

const DetailsAccountId = () => {
    return (
        <>
            <BackButton />
            <div className="flex flex-col items-center justify-center pt-6 pb-1">
                <h1 className="text-4xl font-bold text-center whitespace-pre-line">
                    Account's
                    {"\n"}Details
                </h1>
            </div>
            <div className="p-4">
                <AccountDetails />
            </div>
        </>
    );
};

export default DetailsAccountId;