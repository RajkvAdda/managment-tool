import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getRole'],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (filter) => ({ url: `/roles?${filter ?? 'sort=createdAt'}`, method: 'GET' }),
      providesTags: ['getRole'],
    }),
    getRoleById: builder.query({
      query: (id) => ({ url: `/roles/${id}`, method: 'GET' }),
    }),
    addRole: builder.mutation({
      query: (body) => ({ url: `/roles`, method: 'POST', body }),
      invalidatesTags: ['getRole'],
    }),
    updateRole: builder.mutation({
      query: ({ id, body }) => ({ url: `/roles/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getRole'],
    }),
    deleteRole: builder.mutation({
      query: ({ id, ids }) => ({
        url: id ? `/roles/${id}` : '/roles',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['getRole'],
    }),
  }),
});

export const {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useGetRolesQuery,
} = roleApi;

export default roleApi;
