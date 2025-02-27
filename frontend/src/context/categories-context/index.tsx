import React, { ReactNode, createContext, useContext } from 'react';
import { apiCategories } from '../../api';
import { useFetchAll } from '../../hooks/useFetchAll';
import { Category } from '../../components/categories/interface-category';
import { colors } from '../../utils/colors';
import { iconsCategories } from '../../utils/iconsCategories';
import { AsteriskIcon } from '../../components/ui/icons/AsteriskIcon';

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

    const categoriesWithIconsAndColors = data?.data?.map((category, index) => {
        const matchingIcon = iconsCategories.find((icon) => icon.name === category.name);

        return { 
            ...category,
            color: colors[index % colors.length],
            icon: matchingIcon ? matchingIcon.icon : AsteriskIcon, //fallback si no hay icono
        };
    }) || [];

    return (
        <CategoriesContext.Provider value={{ categories: categoriesWithIconsAndColors, loading, error }}>
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