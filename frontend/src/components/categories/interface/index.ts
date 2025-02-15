export type CategoryType = 'income' | 'expense';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
};