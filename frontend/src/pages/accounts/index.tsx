import PlusButton from "../../components/ui/plus-btn";
import AccountsList from "../../components/accounts/crud/read-all";
import BalanceBox from "../../components/ui/balance-box";
import useVisibleBalance from "../../hooks/useVisibleBalance";

const Accounts = () => {
    const { visibleBalance, refetch } = useVisibleBalance();

    return (
        <>
            <div className="flex flex-col items-center justify-center m-6">
                <h1 className="text-4xl font-bold">ACCOUNTS</h1>
            </div>
            <BalanceBox balance={visibleBalance} />
            <div className="p-4">
                <AccountsList refetchBalance={refetch} />
            </div>
            <div className="flex justify-center my-6">
                <PlusButton to="/accounts/newaccount" />
            </div>
        </>
    );
};

export default Accounts;