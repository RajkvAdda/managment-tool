import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../components/Loadable';

const ErrorLayout = Loadable(lazy(() => import('../layouts/error/index')));
const Page404 = Loadable(lazy(() => import('../pages/error/Page404')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const ErrorRoutes = () => ({
  path: `/error`,
  element: <ErrorLayout />,
  children: [
    { element: <Navigate to="/error/404" />, index: true },
    { path: '/error/404', element: <Page404 /> },
  ],
});

export default ErrorRoutes;
