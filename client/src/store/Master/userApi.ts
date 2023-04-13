import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getUsers', 'loginuser'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ filter, masterFilter }) => ({
        url: `/users?${filter ?? 'sort=createdAt'}`,
        method: 'POST',
        body: masterFilter,
      }),
      providesTags: ['getUsers'],
    }),
    getUserById: builder.query({
      query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
    }),
    addUser: builder.mutation({
      query: (body) => ({ url: `/users/create`, method: 'POST', body }),
      invalidatesTags: ['getUsers'],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getUsers'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['getUsers'],
    }),
    getLoginUser: builder.query({
      query: () => ({ url: `/users/loginuser`, method: 'GET' }),
    }),
    updateUserPassword: builder.mutation({
      query: (body) => ({ url: `/users/updatepassword`, method: 'PUT', body }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetLoginUserQuery,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} = userApi;

export default userApi;
