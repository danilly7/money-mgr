import React from 'react';
import { useCategories } from '../../../../context/categories-context';
import { AsteriskIcon } from '../../../ui/icons/AsteriskIcon';
import { formattedDate } from '../../../../utils/formattedDate';
import { useFetchAll } from '../../../../hooks/useFetchAll';
import useFetchAllTransactions from '../../../../hooks/useFetchAllTransactions';
import { Account } from '../../../accounts/interface-account';
import { apiAccounts } from '../../../../api';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { LoadMoreButton } from '../../../ui/load-more-btn';

interface TransactionListProps {
    isExpense: boolean;
    timeframe: "Day" | "Week" | "Month" | "Year";
}

const TransactionList: React.FC<TransactionListProps> = ({ isExpense, timeframe }) => {
    const { categories } = useCategories();
    const { transactions, loading, error, hasMore, loadMore } = useFetchAllTransactions();

    //aquí no he podido hacer un custom hook pq es un mapeo abajo y me saltaba la consola si lo usaba dentro
    const { data: accountsData } = useFetchAll<Account>(apiAccounts, "accounts", true);

    const accountNamesMap = React.useMemo(() => {
        if (!accountsData.data) return {};
        return accountsData.data.reduce((acc, account) => {
            if (account.id !== undefined) {
                acc[account.id] = account.name;
            }
            return acc;
        }, {} as Record<number | string, string>);
    }, [accountsData]);

    const getCategoryDetails = (categoryId: number) => {
        return categories.find((category) => category.id === categoryId);
    };

    const filterByTimeframe = (transactionDate: Date) => {
        const today = new Date();

        switch (timeframe) {
            case "Day":
                return isWithinInterval(transactionDate, {
                    start: startOfDay(today),
                    end: endOfDay(today),
                });

            case "Week":
                return isWithinInterval(transactionDate, {
                    start: startOfWeek(today),
                    end: endOfWeek(today),
                });

            case "Month":
                return isWithinInterval(transactionDate, {
                    start: startOfMonth(today),
                    end: endOfMonth(today),
                });

            case "Year":
                return isWithinInterval(transactionDate, {
                    start: startOfYear(today),
                    end: endOfYear(today),
                });

            default:
                return false;
        }
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (!transaction.date) return false;

        const category = getCategoryDetails(transaction.category_id);
        if (!category) return false;

        const isTimeframeValid = filterByTimeframe(transaction.date);
        if (!isTimeframeValid) return false;

        if (isExpense) {
            return category.type === "expense";
        }
        return category.type === "income";
    });

    if (loading && transactions.length === 0) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
    }

    if (filteredTransactions.length === 0) {
        return <div className="text-center py-8 text-gray-500">No transactions yet</div>;
    }

    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className={`relative flex flex-col items-center mx-auto my-8 border-4 overflow-hidden rounded-lg shadow-lg max-w-lg w-full
            ${isExpense ? 'border-personalizedPink' : 'border-personalizedGreen'}
        `}>
            {sortedTransactions.map((transaction, index) => {
                const category = getCategoryDetails(transaction.category_id);
                const accountName = accountNamesMap[transaction.account_id] || "not found";

                if (!category) {
                    return (
                        <div key={transaction.id} className="p-4 bg-gray-100 w-full text-center">
                            <div className="text-gray-500">Categoría no encontrada</div>
                        </div>
                    );
                }

                const Icon = category.icon || AsteriskIcon;
                const iconColor = category.color && category.color.startsWith('#') ? category.color : `#${category.color || '000000'}`;

                return (
                    <div key={transaction.id} className="p-4 bg-white w-full">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-3 w-2/3">
                                <div
                                    className="w-10 h-10 flex justify-center items-center rounded-full"
                                    style={{ backgroundColor: iconColor }}
                                >
                                    <Icon className="w-6 h-6 text-black" />
                                </div>
                                <span className="font-semibold text-gray-700 text-lg">{transaction.amount} €</span>
                            </div>

                            <span className="text-sm text-gray-500">{formattedDate(new Date(transaction.date))}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span
                                className="text-sm text-gray-600 truncate max-w-[66%]"
                                title={transaction.comment || ''}
                            >
                                {transaction.comment || ''}
                            </span>
                            <span className="text-sm text-gray-500 w-1/3 text-right">{accountName}</span>
                        </div>

                        {index !== sortedTransactions.length - 1 && (
                            <div className="border-t-2 border-gray-300 w-full mt-6" />
                        )}
                    </div>
                );
            })}

            {hasMore && (
                <div className="bg-white w-full flex justify-center">
                    <div className="p-4 w-[95%] flex justify-center border-t-2 border-gray-300">
                    <LoadMoreButton onClick={loadMore} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;