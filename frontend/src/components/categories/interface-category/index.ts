import { ElementType } from "react";

export type CategoryType = 'income' | 'expense';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
    color: string;
    icon: ElementType;
};