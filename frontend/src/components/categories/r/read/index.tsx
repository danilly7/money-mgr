import { useCategories } from '../../../../context/categories-context';
import ErrorBox from '../../../ui/error-announcement';
import Spinner from '../../../ui/spinner';

export const CategoriesList: React.FC = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorBox message={error.message} />
  }

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong> - {category.type}
          </li>
        ))}
      </ul>
    </div>
  );
};