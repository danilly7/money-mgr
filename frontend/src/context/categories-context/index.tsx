import React, { ReactNode, createContext, useContext } from 'react';
import { apiCategories } from '../../api';
import { useFetchAll } from '../../hooks/useFetchAll';
import { Category } from '../../components/categories/interface';

interface CategoriesProviderProps {
    children: ReactNode;
}

interface CategoriesContextType {
    categories: Category[];
    loading: boolean;
    error: Error | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
    const { data, loading, error } = useFetchAll<Category>(apiCategories, 'categories', false);

    return (
        <CategoriesContext.Provider value={{ categories: data.data, loading, error }}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = (): CategoriesContextType => {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
};
