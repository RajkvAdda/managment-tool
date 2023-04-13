import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const designationApi = createApi({
  reducerPath: 'designationApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getDesignation'],
  endpoints: (builder) => ({
    getDesignations: builder.query({
      query: (filter) => ({ url: `/designations?${filter ?? 'sort=createdAt'}`, method: 'GET' }),
      providesTags: ['getDesignation'],
    }),
    getDesignationById: builder.query({
      query: (id) => ({ url: `/designations/${id}`, method: 'GET' }),
    }),
    addDesignation: builder.mutation({
      query: (body) => ({ url: `/designations`, method: 'POST', body }),
      invalidatesTags: ['getDesignation'],
    }),
    updateDesignation: builder.mutation({
      query: ({ id, body }) => ({ url: `/designations/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getDesignation'],
    }),
    deleteDesignation: builder.mutation({
      query: ({ id, ids }) => ({
        url: id ? `/designations/${id}` : '/designations',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['getDesignation'],
    }),
  }),
});

export const {
  useGetDesignationByIdQuery,
  useGetDesignationsQuery,
  useAddDesignationMutation,
  useDeleteDesignationMutation,
  useUpdateDesignationMutation,
} = designationApi;

export default designationApi;
