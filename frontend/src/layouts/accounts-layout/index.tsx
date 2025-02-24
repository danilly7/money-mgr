import { Outlet } from "react-router-dom";
import { AccountsProvider } from "../../context/accounts-context";

const AccountsLayout = () => {
    return (
        <AccountsProvider>
            <Outlet />
        </AccountsProvider>
    );
};

export default AccountsLayout;