import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const masterFilterApi = createApi({
  reducerPath: 'masterFilterApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getMasterFilter'],
  endpoints: (builder) => ({
    getMasterFilters: builder.query({
      query: (filter) => ({ url: `/masterfilter?${filter ?? 'sort=createdAt'}`, method: 'GET' }),
      providesTags: ['getMasterFilter'],
    }),
    getMasterFilterById: builder.query({
      query: (id) => ({ url: `/masterfilter/${id}`, method: 'GET' }),
    }),
    addMasterFilter: builder.mutation({
      query: (body) => ({ url: `/masterfilter`, method: 'POST', body }),
      invalidatesTags: ['getMasterFilter'],
    }),
    updateMasterFilter: builder.mutation({
      query: ({ id, body }) => ({ url: `/masterfilter/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getMasterFilter'],
    }),
    deleteMasterFilter: builder.mutation({
      query: ({ id, ids }) => ({
        url: id ? `/masterfilter/${id}` : '/masterfilter',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['getMasterFilter'],
    }),
  }),
});

export const {
  useAddMasterFilterMutation,
  useDeleteMasterFilterMutation,
  useGetMasterFilterByIdQuery,
  useUpdateMasterFilterMutation,
  useGetMasterFiltersQuery,
} = masterFilterApi;

export default masterFilterApi;
