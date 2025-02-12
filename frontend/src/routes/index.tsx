import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const RequireAuth = lazy(() => import('../components/welcome/required-auth'));

const Home = lazy(() => import('../pages/home'));
const Welcome = lazy(() => import('../pages/welcome'));
const Accounts = lazy(() => import('../pages/accounts'));
const Categories = lazy(() => import('../pages/categories'));
const User = lazy(() => import('../pages/user'));
const ErrorPage = lazy(() => import('../pages/error/index'));

const Login = lazy(() => import('../components/welcome/login'));
const Register = lazy(() => import('../components/welcome/register'));

export const routes: RouteObject[] = [
    {
        path: '/welcome',
        element: <AuthLayout />,
        children: [
            {
                path: '',
                element: <Welcome />,
            },
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
        path: '/',
        element: <RequireAuth />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: [
                    {
                        path: "",
                        element: <Home />
                        //faltan los children
                    },
                    {
                        path: "accounts",
                        element: <Accounts />
                        //faltan los children
                    },
                    {
                        path: "categories",
                        element: <Categories />
                        //faltan los children
                    },
                    {
                        path: "user",
                        element: <User />
                        //faltan los children
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
];