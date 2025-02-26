export interface Transaction {
    id?: number;
    category_id: number;
    account_id: number;
    amount: number;
    comment?: string;
    date: Date;
};