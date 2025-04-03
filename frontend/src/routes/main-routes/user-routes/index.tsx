import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const User = lazy(() => import('../../../pages/user'));

export const userRoutes: RouteObject = {
    path: "user",
    element: <User />
};