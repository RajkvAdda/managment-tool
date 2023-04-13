import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getDepartment'],
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: (filter) => ({ url: `/departments?${filter ?? 'sort=createdAt'}`, method: 'GET' }),
      providesTags: ['getDepartment'],
    }),
    getDepartmentById: builder.query({
      query: (id) => ({ url: `/departments/${id}`, method: 'GET' }),
    }),
    addDepartment: builder.mutation({
      query: (body) => ({ url: `/departments`, method: 'POST', body }),
      invalidatesTags: ['getDepartment'],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, body }) => ({ url: `/departments/${id}`, method: 'PUT', body }),
      invalidatesTags: ['getDepartment'],
    }),
    deleteDepartment: builder.mutation({
      query: ({ id, ids }) => ({
        url: id ? `/departments/${id}` : '/departments',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['getDepartment'],
    }),
  }),
});

export const {
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByIdQuery,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} = departmentApi;

export default departmentApi;
