import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: customBaseQuery,
  tagTypes: ['getPage'],
  endpoints: (builder) => ({
    getPages: builder.query({
      query: (filter) => ({ url: `/pages?${filter ?? 'sort=name'}`, method: 'GET' }),
      providesTags: ['getPage'],
    }),
    getPageById: builder.query({
      query: (id) => ({ url: `/pages/${id}`, method: 'GET' }),
    }),
    addPage: builder.mutation({
      query: (body) => ({ url: `/pages?secretkey=rajKV@1991`, method: 'POST', body }),
      invalidatesTags: ['getPage'],
    }),
    updatePage: builder.mutation({
      query: ({ id, body }) => ({ url: `/pages/${id}?secretkey=rajKV@1991`, method: 'PUT', body }),
      invalidatesTags: ['getPage'],
    }),
    deletePage: builder.mutation({
      query: (id) => ({
        url: id ? `/pages/${id}?secretkey=rajKV@1991` : '/pages',
        method: 'DELETE',
      }),
      invalidatesTags: ['getPage'],
    }),
  }),
});

export const {
  useAddPageMutation,
  useDeletePageMutation,
  useGetPageByIdQuery,
  useUpdatePageMutation,
  useGetPagesQuery,
} = pageApi;

export default pageApi;
