import { combineReducers } from 'redux';

// reducer
import authSlice from './auth/authSlice';
import commonSlice from './common/commonSlice';
import customizationSlice from './customization/customizationSlice';
import CommonApi from './common/commonApi';
import authApi from './auth/authApi';

// ===================|| MASTER ||==================== //

import companyApi from './Master/companyApi';
import userApi from './Master/userApi';
import branchApi from './Master/branchApi';
import roleApi from './Master/roleApi';
import pageApi from './Master/pageApi';
import departmentApi from './Master/departmentApi';
import designationApi from './Master/designationApi';
import masterFilterApi from './Master/masterFilterApi';

// ===================|| SALES ||==================== //

export const masterMiddleware = [
  authApi.middleware,
  CommonApi.middleware,
  // ===================|| MASTER ||==================== //
  companyApi.middleware,
  userApi.middleware,
  branchApi.middleware,
  roleApi.middleware,
  pageApi.middleware,
  designationApi.middleware,
  departmentApi.middleware,
  masterFilterApi.middleware,
  // ===================|| SALES ||==================== //
];

export default combineReducers({
  customization: customizationSlice,
  auth: authSlice,
  commonstate: commonSlice,
  [CommonApi.reducerPath]: CommonApi.reducer,
  [authApi.reducerPath]: authApi.reducer,

  // ===================|| MASTER ||==================== //
  [companyApi.reducerPath]: companyApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [pageApi.reducerPath]: pageApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [designationApi.reducerPath]: designationApi.reducer,
  [masterFilterApi?.reducerPath]: masterFilterApi.reducer,

  // ===================|| SALES ||==================== //

  // ===================|| MASTER ||==================== //
});
