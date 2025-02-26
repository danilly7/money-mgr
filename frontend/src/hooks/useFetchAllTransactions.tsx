import { Transaction } from '../components/transactions/interface-transaction';
import { useFetchByPage } from './useFetchByPage';
import { apiTransactions } from '../api';
import { useState } from 'react';

const useFetchAllTransactions = () => {
    const [page, setPage] = useState(1);

    const { data: fetchedTransactions, loading, error, hasMore } = useFetchByPage<Transaction>(
        apiTransactions, 
        page, 
        true, 
        'transactions' //importante estea es la dataKey para poder usar useFetchByPage
    );

    const transactions = fetchedTransactions.data ?? [];

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return { transactions, loading, error, hasMore, loadMore };
};

export default useFetchAllTransactions;