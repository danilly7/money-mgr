import { BackButton } from "../../../components/ui/back-btn";
import NewAccountForm from "../../../components/accounts/crud/create";

const NewAccount = () => {
    return (
        <>
            <BackButton />
            <div className="flex flex-col items-center justify-center pt-6 pb-1">
                <h1 className="text-4xl font-bold text-center whitespace-pre-line">
                    New
                    {"\n"}Account
                </h1>
            </div>
            <div className="p-4">
                <NewAccountForm />
            </div>
        </>
    );
};

export default NewAccount;