import React from 'react';
import { Transaction } from '../../interface-transaction';
import { useCategories } from '../../../../context/categories-context';
import { AsteriskIcon } from '../../../ui/icons/AsteriskIcon';
import { formattedDate } from '../../../../utils/formattedDate';

interface TransactionListProps {
    transactions: Transaction[];
    isExpense: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isExpense }) => {
    const { categories } = useCategories();

    const getCategoryDetails = (categoryId: number) => {
        return categories.find((category) => category.id === categoryId);
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No transactions
            </div>
        );
    }

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className={`relative flex flex-col items-center mx-auto my-8 border-4 overflow-hidden rounded-lg shadow-lg max-w-lg w-full
            ${isExpense ? 'border-personalizedPink' : 'border-personalizedGreen'}
        `}>
            {sortedTransactions.map((transaction, index) => {
                const category = getCategoryDetails(transaction.category_id);

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
                            <span className="text-sm text-gray-500 w-1/3 text-right">Account {transaction.account_id}</span>
                        </div>

                        {index !== sortedTransactions.length - 1 && (
                            <div className="border-t-2 border-gray-300 w-full mt-6" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionList;