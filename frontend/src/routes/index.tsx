import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Welcome = lazy(() => import('../pages/welcome'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Welcome />,
    },
];