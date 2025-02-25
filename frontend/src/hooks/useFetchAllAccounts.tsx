import { Account } from '../components/accounts/interface-account';
import { useFetchAll } from './useFetchAll';
import { apiAccounts } from '../api';

const useFetchAllAccounts = () => {
  const { data: fetchedAccounts, loading, error, refetch } = useFetchAll<Account>(apiAccounts, 'accounts', true);

  const accounts = fetchedAccounts.data ?? [];

  return { accounts, loading, error, refetchAccounts: refetch };
};

export default useFetchAllAccounts;