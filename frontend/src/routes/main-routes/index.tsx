import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { accountRoutes } from './account-routes';
import { categoryRoutes } from './category-routes';
import { transactionRoutes } from './transaction-routes';
import { userRoutes } from './user-routes';

const RequireAuth = lazy(() => import('../../components/intro/required-auth'));
const MainLayout = lazy(() => import('../../layouts/main-layout'));
const Home = lazy(() => import('../../pages/home'));

export const mainRoutes: RouteObject = {
    path: '/',
    element: <RequireAuth />,
    children: [
        {
            path: '',
            element: <MainLayout />,
            children: [
                { index: true, element: <Home /> },
                accountRoutes,
                categoryRoutes,
                userRoutes,
                transactionRoutes,
            ],
        },
    ],
};