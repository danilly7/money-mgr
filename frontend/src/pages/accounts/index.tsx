import { PlusButton } from "../../components/ui/plus-btn";
import AccountsList from "../../components/accounts/crud/read";
import BalanceBox from "../../components/ui/balance-box";

const Accounts = () => {


    return (
        <>
            <div className="flex flex-col items-center justify-center m-6">
                <h1 className="text-4xl font-bold">ACCOUNTS</h1>
            </div>
            <BalanceBox balance={0}/>
            <div className="p-4">
                <AccountsList />
            </div>
            <div className="flex justify-center my-6">
                <PlusButton to="/accounts/newaccount" />
            </div>
        </>
    );
};

export default Accounts;