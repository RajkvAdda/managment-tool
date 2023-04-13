import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../components/Loadable';

const AuthLayout = Loadable(lazy(() => import('../layouts/auth')));

const Login = Loadable(lazy(() => import('../pages/auth/login')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/forgotPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthRoute = (isLoggedIn) => ({
  path: `/`,
  element: !isLoggedIn ? <AuthLayout /> : <Navigate to={`/dashboard`} replace />,
  children: [
    { element: <Navigate to="/login" />, index: true },
    {
      path: `/login`,
      element: <Login />,
    },
    {
      path: `/forgotpassword`,
      element: <ForgotPassword />,
    },
    {
      path: '*',
      element: <Navigate to="/error/404" replace />,
    },
  ],
});

export default AuthRoute;
