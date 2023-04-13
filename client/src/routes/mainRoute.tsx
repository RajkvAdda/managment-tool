import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../components/Loadable';

const MainLayout = Loadable(lazy(() => import('../layouts/dashboard')));
const Page401 = Loadable(lazy(() => import('../pages/error/Page401')));

// ==============================|| DASHBOARD ||============================== //

const DashboardIndex = Loadable(lazy(() => import('../pages/dashboard')));
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/dashboardPage')));
const BlogPage = Loadable(lazy(() => import('../pages/dashboard/BlogPage')));
const UserPage = Loadable(lazy(() => import('../pages/dashboard/UserPage')));
const ProductsPage = Loadable(lazy(() => import('../pages/dashboard/ProductsPage')));

// ==============================|| SETTING ||============================== //
const SettingIndex = Loadable(lazy(() => import('../pages/setting')));
const CustomizationPage = Loadable(lazy(() => import('../pages/setting/customization')));

// ==============================|| MASTER ||============================== //
const MasterIndex = Loadable(lazy(() => import('../pages/master')));
const Company = Loadable(lazy(() => import('../pages/master/company')));
const Branch = Loadable(lazy(() => import('../pages/master/branch')));
const User = Loadable(lazy(() => import('../pages/master/user')));
const Role = Loadable(lazy(() => import('../pages/master/role')));
const Department = Loadable(lazy(() => import('../pages/master/department')));
const Designation = Loadable(lazy(() => import('../pages/master/designation')));
const Page = Loadable(lazy(() => import('../pages/master/page')));
const PageRole = Loadable(lazy(() => import('../pages/master/page_role')));

const MainRoutes = (isLoggedIn: boolean | undefined) => ({
  path: `/`,
  element: isLoggedIn ? <MainLayout /> : <Navigate to={`/login`} replace />,
  children: [
    { element: <Navigate to="/dashboard" />, index: true },

    // ==============================|| DASHBOARD ||============================== //

    {
      path: '/dashboard',
      element: <DashboardIndex />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '/dashboard/app', element: <Dashboard /> },
        { path: '/dashboard/user', element: <UserPage /> },
        { path: '/dashboard/products', element: <ProductsPage /> },
        { path: '/dashboard/products/blog', element: <BlogPage /> },
      ],
    },

    // ==============================|| SETTING ||============================== //
    {
      path: '/setting',
      element: <SettingIndex />,
      children: [
        { element: <Navigate to="/setting/customization" />, index: true },
        { path: '/setting/customization', element: <CustomizationPage /> },
      ],
    },

    // ==============================|| Master ||============================== //
    {
      path: '/master',
      element: <MasterIndex />,
      children: [
        { element: <Navigate to="/master/company" />, index: true },
        { path: '/master/company', element: <Company /> },
        { path: '/master/branch', element: <Branch /> },
        { path: '/master/users', element: <User /> },
        { path: '/master/user/role', element: <Role /> },
        { path: '/master/user/designation', element: <Designation /> },
        { path: '/master/user/department', element: <Department /> },
        { path: '/master/user/page', element: <Page /> },
        { path: '/master/user/page_role', element: <PageRole /> },
        { path: '/master/user/notauthorize', element: <Page401 /> },
      ],
    },

    // ==============================|| ERROR ||============================== //
    {
      path: '*',
      element: <Navigate to="/error/404" replace />,
    },
  ],
});

export default MainRoutes;
