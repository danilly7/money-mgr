import { useCategories } from '../../../../context/categories-context';
import ErrorBox from '../../../ui/error-box';
import Spinner from '../../../ui/spinner';

interface CategoriesListProps {
    isExpense: boolean;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ isExpense }) => {
    const { categories, loading, error } = useCategories();

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <ErrorBox message={error.message} />
    }

    const filteredCategories = categories.filter((category) => category.type === (isExpense ? 'expense' : 'income'));

    return (
        <div className="flex justify-center">
            <div className="flex flex-wrap justify-center m-6 gap-x-4 gap-y-4 max-w-[80%]">
                {filteredCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.id}
                            className="group flex items-center justify-center 
                                       w-32 h-32 lg:w-36 lg:h-36
                                       rounded-full border-4 border-black text-center
                                       transition-all duration-300 hover:rotate-3 hover:scale-110 hover:shadow-lg hover:bg-opacity-90"
                            style={{ backgroundColor: category.color.color }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <Icon className="w-7 h-7 lg:w-9 lg:h-9 text-black transition-all duration-300" />
                                
                                <strong className="text-sm lg:text-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    {category.name}
                                </strong>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};