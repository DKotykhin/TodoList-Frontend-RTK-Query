import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getToken } from "./getToken";
import {
    IAddTask,
    ICompleteTask,
    IQueryData,
    IUpdateTask,
} from "types/taskTypes";
import {
    ITaskResponse,
    ITaskDeleteResponse,
    IGetTasksResponse,
} from "types/responseTypes";

const Base_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchTask = createApi({
    reducerPath: "fetchTask",
    baseQuery: fetchBaseQuery({ baseUrl: Base_URL }),
    tagTypes: ["Task"],
    endpoints: (builder) => ({
        fetchAllTasks: builder.query<IGetTasksResponse, IQueryData>({
            query: (data) => ({
                url: "/task",
                headers: { Authorization: `Bearer ${getToken()}` },
                params: {
                    limit: data.limit,
                    page: data.page,
                    tabKey: data.tabKey,
                    sortField: data.sortField,
                    sortOrder: data.sortOrder,
                    search: data.search,
                },
            }),
            providesTags: ["Task"],
        }),

        fetchAddTask: builder.mutation<ITaskResponse, IAddTask>({
            query: (data) => ({
                method: "POST",
                url: "/task",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["Task"],
        }),

        fetchUpdateTask: builder.mutation<
            ITaskResponse,
            IUpdateTask | ICompleteTask
        >({
            query: (data) => ({
                method: "PATCH",
                url: "/task",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["Task"],
        }),

        fetchDeleteTask: builder.mutation<ITaskDeleteResponse, { _id: string }>(
            {
                query: (data) => ({
                    method: "DELETE",
                    url: "/task",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }),
                invalidatesTags: ["Task"],
            }
        ),
    }),
});

export const {
    useFetchAllTasksQuery,
    useFetchAddTaskMutation,
    useFetchUpdateTaskMutation,
    useFetchDeleteTaskMutation,
} = fetchTask;
