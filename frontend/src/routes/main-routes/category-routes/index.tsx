import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Categories = lazy(() => import('../../../pages/categories'));

export const categoryRoutes: RouteObject = {
    path: "categories",
    element: <Categories />,
};