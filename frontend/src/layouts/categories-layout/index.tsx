import { Outlet } from "react-router-dom";
import { CategoriesProvider } from "../../context/categories-context";

const CategoriesLayout = () => {
  return (
    <CategoriesProvider>
      <Outlet />
    </CategoriesProvider>
  );
};

export default CategoriesLayout;