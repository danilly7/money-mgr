import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TransactionsLayout = lazy(() => import('../../../layouts/transactions-layout'));
const ViewOfTransactions = lazy(() => import('../../../pages/transactions'));
const NewTransaction = lazy(() => import("../../../pages/transactions/new-transaction"));
const DetailsTransactionId = lazy(() => import("../../../pages/transactions/details-transaction"));

export const transactionRoutes: RouteObject = {
    path: "transactions",
    element: <TransactionsLayout />,
    children: [
        { index: true, element: <ViewOfTransactions /> },
        { path: "newtransaction", element: <NewTransaction /> },
        { path: "transac/:transactionId", element: <DetailsTransactionId /> },
    ],
};