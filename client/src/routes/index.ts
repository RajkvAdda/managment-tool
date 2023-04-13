import { useRoutes } from 'react-router-dom';

import MainRoutes from './mainRoute';
import AuthRoutes from './authRoute';
import ErrorRoutes from './errorRoute';
import { useAppSelector } from '../store/hooks';

// ==============================|| ROUTING RENDER ||============================== //

const Routes = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return useRoutes([MainRoutes(isLoggedIn), AuthRoutes(isLoggedIn), ErrorRoutes()]);
};
export default Routes;
