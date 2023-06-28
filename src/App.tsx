import { createBrowserRouter } from "react-router-dom";

import Layout from "layout/Layout";
import { withAuth } from "hocs/withAuth";

import { AddTaskPage, HomePage, LoginPage, ProfilePage, RegistrationPage, Page404, ResetPasswordPage, SetNewPasswordPage, ChangePasswordPage, UpdateTaskPage } from "pages/_index";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <Page404 />,
        children: [
            {
                path: '/',
                element: withAuth(HomePage),
            },
            {
                path: 'addtask',
                element: withAuth(AddTaskPage),
            },
            {
                path: 'updatetask/:taskId',
                element: withAuth(UpdateTaskPage),
            },
            {
                path: 'profile',
                element: withAuth(ProfilePage),
            },
            {
                path: 'password',
                element: withAuth(ChangePasswordPage),
            },
            {
                path: 'registration',
                element: <RegistrationPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'reset',
                element: <ResetPasswordPage />,
            },
            {
                path: 'auth/reset/:token',
                element: <SetNewPasswordPage />,
            },
        ],
    },
]);
