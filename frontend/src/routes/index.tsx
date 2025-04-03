import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { authRoutes } from './auth-routes';
import { mainRoutes } from './main-routes';

const ErrorPage = lazy(() => import('../pages/error/index'));

export const routes: RouteObject[] = [
    authRoutes,
    mainRoutes,
    { path: '*', element: <ErrorPage /> },
];