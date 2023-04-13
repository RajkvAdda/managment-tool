import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery: customBaseQuery,
  tagTypes: [''],
  endpoints: (builder) => ({
    getLocation: builder.query({
      query: (address) => ({ url: `/getlocation?address=${address}`, method: 'GET' }),
    }),
  }),
});

export const { useGetLocationQuery } = commonApi;

export default commonApi;
