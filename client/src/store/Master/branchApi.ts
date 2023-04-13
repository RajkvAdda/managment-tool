import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const branchApi = createApi({
  reducerPath: 'branchApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getBranch'],
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: (filter) => ({ url: `/branches?${filter ?? 'sort=createdAt'}`, method: 'GET' }),
      providesTags: ['getBranch'],
    }),
    getBranchById: builder.query({
      query: (id) => ({ url: `/branches/${id}`, method: 'GET' }),
    }),
    addBranch: builder.mutation({
      query: (body) => ({ url: `/branches`, method: 'POST', body }),
      invalidatesTags: ['getBranch'],
    }),
    updateBranch: builder.mutation({
      query: ({ id, body }) => ({ url: `/branches/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getBranch'],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({ url: `/branches/${id}`, method: 'DELETE' }),
      invalidatesTags: ['getBranch'],
    }),
  }),
});

export const {
  useAddBranchMutation,
  useDeleteBranchMutation,
  useGetBranchByIdQuery,
  useGetBranchesQuery,
  useUpdateBranchMutation,
} = branchApi;

export default branchApi;
