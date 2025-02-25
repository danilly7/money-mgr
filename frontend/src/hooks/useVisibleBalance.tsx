import { useState, useEffect } from "react";
import { useFetchAll } from "./useFetchAll";
import { apiAccounts } from "../api";
import { Account } from "../components/accounts/interface-account";

const useVisibleBalance = () => {
  const [visibleBalance, setVisibleBalance] = useState<number>(0);
  const { data: fetchedAccounts, loading, error, refetch } = useFetchAll<Account>(apiAccounts, 'accounts', true);

  //este hook se puede usar de manera vertical en toda la app
  useEffect(() => {
    if (fetchedAccounts?.data) {
      const balance = fetchedAccounts.data
        .filter(account => account.visibility)
        .reduce((sum, account) => {
          const balance = Number(account.balance);
          return isNaN(balance) ? sum : sum + balance;
        }, 0);

      setVisibleBalance(balance);
    }
  }, [fetchedAccounts]);

  return { visibleBalance, loading, error, refetch };
};

export default useVisibleBalance;