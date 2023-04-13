import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../hooks';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({ url: `/auth/login`, method: 'POST', body })
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({ url: `auth/forgotpassword`, method: 'POST', body })
        }),
        resetPassword: builder.mutation({
            query: ({ resettoken, body }) => ({
                url: `/auth/resetpassword/${resettoken}`,
                method: 'PUT',
                body
            })
        }),
        logout: builder.mutation({
            query: () => ({ url: `auth/logout`, method: 'GET' })
        }),
        refreshToken: builder.mutation({
            query: () => ({ url: `User/refreshtoken`, method: 'POST' })
        })
    })
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation
} = authApi;

export default authApi;
