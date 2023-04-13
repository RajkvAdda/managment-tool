import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppDispatch, RootState } from './index';
import { createBrowserHistory } from 'history';

export const baseUrlGenerator = () => {
  const host = window.location.hostname?.split('.')[0];
  console.log('host', host);
  switch (host) {
    case '127':
      return 'http://localhost:5000/api/v1';
    default:
      return 'https://3jqwxby6ye.execute-api.ap-south-1.amazonaws.com/dev/api/v1';
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrlGenerator(),
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token ?? 0;
    console.log('token', token);
    headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});
// const history = createBrowserHistory();

export const customBaseQuery = async (args: any, api: BaseQueryApi, extraOptions: {}) => {
  const result: any = await baseQuery(args, api, extraOptions);
  console.log('result', result, args, api);
  if ((args?.method === 'GET' || args?.method === 'POST') && [403, 401].includes(result?.error?.status)) {
    window.location.href = 'http://127.0.0.1:4200/master/user/notauthorize';
    return;
  }
  return result;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
