import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../layouts/auth-layout'));
const RequireAuth = lazy(() => import('../components/welcome/required-auth'));
const MainLayout = lazy(() => import('../layouts/main-layout'));
const AccountsLayout = lazy(() => import('../layouts/accounts-layout'));
const TransactionsLayout = lazy(() => import('../layouts/transactions-layout'));

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
const NewTransaction = lazy(() => import("../pages/transactions/new-transaction"));

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
                            },
                        ]
                    },
                    {
                        path: "categories",
                        element: <Categories />,
                    },
                    {
                        path: "user",
                        element: <User />
                    },
                    {
                        path: "transactions",
                        element: <TransactionsLayout />,
                        children: [
                            {
                                index: true, //raíz /transactions
                                element: <ViewOfTransactions />,
                            },
                            {
                                path: "newtransaction",
                                element: <NewTransaction />
                            },
                            {
                                path: "transac/:transactionId",
                                // element: <DetailsAccountId />,
                            },
                        ]
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