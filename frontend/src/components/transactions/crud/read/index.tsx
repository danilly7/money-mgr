import React from 'react';
import { Transaction } from '../../interface';
import { useCategories } from '../../../../context/categories-context';
import { AsteriskIcon } from '../../../ui/icons/AsteriskIcon';
import { formattedDate } from '../../../../utils/formattedDate';

interface TransactionListProps {
    transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    const { categories } = useCategories();

    const getCategoryDetails = (categoryId: number) => {
        return categories.find((category) => category.id === categoryId);
    };

    return (
        <div className="flex flex-col space-y-4">
            {transactions.map((transaction) => {
                const category = getCategoryDetails(transaction.category_id);

                if (!category) {
                    return (
                        <div
                            key={transaction.id}
                            className="p-4 bg-gray-100 border-t-2 border-b-2 border-gray-300"
                        >
                            <div className="text-center text-gray-500">Categoría no encontrada</div>
                        </div>
                    );
                }

                const Icon = category.icon || AsteriskIcon;
                const iconColor = category.color && category.color.startsWith('#') ? category.color : `#${category.color || '000000'}`;

                return (
                    <div
                        key={transaction.id}
                        className="p-4 bg-gray-100 border-t-2 border-b-2 border-gray-300"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 flex justify-center items-center rounded-full" style={{ backgroundColor: iconColor }}>
                                <Icon className="w-5 h-5 text-black" />
                            </div>

                            <div className="flex flex-1 justify-between">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{category.name}</span>
                                    <span className="text-sm text-gray-600">{transaction.comment || 'No comment'}</span>
                                </div>

                                <div className="text-sm text-gray-500">Account {transaction.account_id}</div>

                                <div className="text-lg font-bold text-green-600">
                                    {transaction.amount} €
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">{formattedDate(new Date(transaction.date))}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionList;