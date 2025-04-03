import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AccountsLayout = lazy(() => import('../../../layouts/accounts-layout'));
const Accounts = lazy(() => import('../../../pages/accounts'));
const NewAccount = lazy(() => import("../../../pages/accounts/new-account"));
const DetailsAccountId = lazy(() => import("../../../pages/accounts/details-account"));

export const accountRoutes: RouteObject = {
    path: "accounts",
    element: <AccountsLayout />,
    children: [
        { index: true, element: <Accounts /> },
        { path: "newaccount", element: <NewAccount /> },
        { path: "acc/:accountId", element: <DetailsAccountId /> },
    ],
};