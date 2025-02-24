import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../layouts/auth-layout'));
const RequireAuth = lazy(() => import('../components/welcome/required-auth'));
const MainLayout = lazy(() => import('../layouts/main-layout'));
const AccountsLayout = lazy(() => import('../layouts/accounts-layout'));

const Home = lazy(() => import('../pages/home'));
const Welcome = lazy(() => import('../pages/welcome'));
const Accounts = lazy(() => import('../pages/accounts'));
const Categories = lazy(() => import('../pages/categories'));
const User = lazy(() => import('../pages/user'));
const ErrorPage = lazy(() => import('../pages/error/index'));

const Login = lazy(() => import('../components/welcome/login'));
const Register = lazy(() => import('../components/welcome/register'));
const ViewOfTransactions = lazy(() => import('../pages/transactions'));
const NewAccount = lazy(() => import("../pages/accounts/new-account"));
const DetailsAccountId = lazy(() => import("../pages/accounts/details-account"));
// const UpdateAccountId = lazy(() => import("../pages/accounts/update-account"));

export const routes: RouteObject[] = [
    {
        path: '/welcome',
        element: <AuthLayout />,
        children: [
            {
                index: true, //pq no tiene hijos, raíz /welcome
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
                        element: <AccountsLayout />,
                        children: [
                            {
                                index: true, //raíz /accounts
                                element: <Accounts />,
                            },
                            {
                                path: "newaccount",
                                element: <NewAccount />
                            },
                            {
                                path: "acc/:accountId",
                                element: <DetailsAccountId />,
                                // children: [
                                //     {
                                //         path: "update",
                                //         element: <UpdateAccountId />
                                //     }
                                // ]
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