import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../../layouts/auth-layout'));
const Welcome = lazy(() => import('../../pages/welcome'));
const Login = lazy(() => import('../../components/welcome/login'));
const Register = lazy(() => import('../../components/welcome/register'));

export const authRoutes: RouteObject = {
  path: '/welcome',
  element: <AuthLayout />,
  children: [
    { index: true, element: <Welcome /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
  ],
};