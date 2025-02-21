import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../layouts/auth-layout'));
const RequireAuth = lazy(() => import('../components/welcome/required-auth'));
const MainLayout = lazy(() => import('../layouts/main-layout'));

const Home = lazy(() => import('../pages/home'));
const Welcome = lazy(() => import('../pages/welcome'));
const Accounts = lazy(() => import('../pages/accounts'));
const Categories = lazy(() => import('../pages/categories'));
const User = lazy(() => import('../pages/user'));
const ErrorPage = lazy(() => import('../pages/error/index'));

const Login = lazy(() => import('../components/welcome/login'));
const Register = lazy(() => import('../components/welcome/register'));
const ViewOfTransactions = lazy(() => import('../pages/transactions'));
const NewAccount = lazy(()=> import ("../components/accounts/crud/create"));

export const routes: RouteObject[] = [
    {
        path: '/welcome',
        element: <AuthLayout />,
        children: [
            {
                index: true, //pq no tiene hijos
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
                        index: true, //no tiene hijos, es raíz de /
                        element: <Home />,
                    },
                    {
                        path: "accounts",
                        element: <Accounts />,
                        children: [
                            {
                                path: "newaccount",
                                element: <NewAccount />
                            },
                        ]
                    },
                    {
                        path: "categories",
                        element: <Categories />,
                        //children
                    },
                    {
                        path: "user",
                        element: <User />
                        //faltan los children
                    },
                    {
                        path: "transactions",
                        element: <ViewOfTransactions />
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