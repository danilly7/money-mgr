import { PlusButton } from "../../components/ui/plus-btn";
import AccountsList from "../../components/accounts/crud/read";

const Accounts = () => {


    return (
        <>
            <div className="flex flex-col items-center justify-center pt-6">
                <h1 className="text-4xl font-bold">ACCOUNTS</h1>
            </div>
            <div className="p-4">
                <AccountsList />
                <PlusButton to="/accounts/newaccount" />
            </div>
        </>
    );
};

export default Accounts;