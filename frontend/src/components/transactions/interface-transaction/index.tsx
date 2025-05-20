export interface Transaction {
    id?: number;
    category_id: number;
    account_id: number;
    amount: number;
    comment?: string;
    date: Date;

    createdAt: string;
    updatedAt: string;

    category?: {
        id_category: number;
        name: string;
        type: "income" | "expense";
    };

    account?: {
        id: number;
        name: string;
        balance: number;
    };
};

export interface TransactionCreate {
    category_id: number;
    account_id: number;
    amount: number;
    comment?: string;
    date: Date;
}

export interface TransactionUpdate {
    category_id?: number;
    account_id?: number;
    amount?: number;
    comment?: string | null;
    date?: Date | string;
}

export interface ApiError {
    msg: string;
    error?: unknown;
    statusCode?: number;
    stack?: string; 
}