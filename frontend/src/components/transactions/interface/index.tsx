import { Category } from '../../categories/interface';

export interface Transaction {
    id: number;
    category_id: number;
    account_id: number;
    amount: number;
    comment: string;
    category?: Category;
};