import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getToken } from "./getToken";
import { setUserAvatar } from "store/userSlice";
import { IUserLogin, IUserRegister, IUserUpdateName, IUserUpdatePassword } from "types/userTypes";
import {
    IUserAvatarResponse,
    IUserConfirmPasswordResponse,
    IUserUpdatePasswordResponse,
    IUserDeleteResponse,
    IUserResponse,
    IUserWithTokenResponse,
} from "types/responseTypes";

const Base_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchUser = createApi({
    reducerPath: "fetchUser",
    baseQuery: fetchBaseQuery({ baseUrl: Base_URL }),
    tagTypes: ["User"],
    endpoints: (builder) => ({

        fetchUserByToken: builder.query<IUserResponse, void>({
            query: () => ({
                url: "/user/me",
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUserAvatar(data));
                } catch (error) {}
            },
            providesTags: ["User"],
        }),

        fetchRegisterUser: builder.mutation<IUserWithTokenResponse, IUserRegister>({
            query: (data) => ({
                url: "/user/register",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["User"],
        }),

        fetchLoginUser: builder.mutation<IUserWithTokenResponse, IUserLogin>({
            query: (data) => ({
                url: "/user/login",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["User"],
        }),

        fetchUpdateUserName: builder.mutation<IUserResponse, IUserUpdateName>({
            query: (data) => ({
                method: "PATCH",
                url: "/user/name",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["User"],
        }),

        fetchUpdateUserPassword: builder.mutation<IUserUpdatePasswordResponse, IUserUpdatePassword>({
            query: (data) => ({
                method: "PATCH",
                url: "/user/password",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["User"],
        }),

        fetchDeleteUser: builder.mutation<IUserDeleteResponse, void>({
            query: () => ({
                method: "DELETE",
                url: "/user/me",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }),
        }),

        fetchUserConfirmPassword: builder.mutation<
            IUserConfirmPasswordResponse,
            { password: string }
        >({
            query: (data) => ({
                method: "POST",
                url: "/user/password",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(data),
            }),
        }),

        fetchUploadAvatar: builder.mutation<IUserAvatarResponse, FormData>({
            query: (data) => ({
                method: "POST",
                url: "/upload",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        fetchDeleteAvatar: builder.mutation<IUserAvatarResponse, void>({
            query: () => ({
                method: "DELETE",
                url: "/upload",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useFetchUserByTokenQuery,
    useFetchLoginUserMutation,
    useFetchUpdateUserNameMutation,
    useFetchUpdateUserPasswordMutation,
    useFetchDeleteAvatarMutation,
    useFetchDeleteUserMutation,
    useFetchRegisterUserMutation,
    useFetchUploadAvatarMutation,
    useFetchUserConfirmPasswordMutation,
} = fetchUser;
