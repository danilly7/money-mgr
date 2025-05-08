import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthLayout = lazy(() => import('../../layouts/auth-layout'));
const Intro = lazy(() => import('../../pages/intro'));
const Login = lazy(() => import('../../components/intro/login'));
const Register = lazy(() => import('../../components/intro/register'));

export const authRoutes: RouteObject = {
  path: '/intro',
  element: <AuthLayout />,
  children: [
    { index: true, element: <Intro /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
  ],
};