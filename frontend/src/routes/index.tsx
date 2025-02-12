import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home'));
const Welcome = lazy(() => import('../pages/welcome'));
const Accounts = lazy(() => import('../pages/accounts'));
const Categories = lazy(() => import('../pages/categories'));
const ErrorPage = lazy(() => import('../pages/error/index'));

const Login = lazy(() => import('../components/welcome/login'));
const Register = lazy(() => import('../components/welcome/register'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
        //faltan los children
    },
    {
        path: '/welcome',
        element: <Welcome />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
        ],
    },
    {
        path: '/accounts',
        element: <Accounts />,
        //faltan los children
    },
    {
        path: '/categories',
        element: <Categories />,
        //faltan los children
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
];