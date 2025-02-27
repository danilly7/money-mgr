import React from "react";

export type CategoryType = 'income' | 'expense';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
    color: string;
    icon: React.ComponentType<{ className?: string }>; 
};