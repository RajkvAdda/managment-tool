import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const companyApi = createApi({
  reducerPath: 'CompanyApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getCompany'],
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: () => ({ url: `/company`, method: 'GET' }),
      providesTags: ['getCompany'],
    }),
    updateCompany: builder.mutation({
      query: ({ id, body }) => ({ url: `/company/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getCompany'],
    }),
  }),
});

export const { useGetCompanyQuery, useUpdateCompanyMutation } = companyApi;

export default companyApi;
