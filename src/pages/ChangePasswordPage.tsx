import React from "react";
import { Navigate } from "react-router-dom";
import Helmet from "react-helmet";

import PasswordForm from "components/userAuthForms/PasswordForm";
import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/isAuth";

const ChangePasswordPage: React.FC = () => {

    const auth = useAuth();

    return auth.isSuccess ? (
        <>
            <Helmet>
                <meta name="description" content="Change Password Page" />
                <title>Change Password Page</title>
            </Helmet>
            <PasswordForm />
        </>
    ) : auth.isError ? <Navigate to="/login" /> : <Spinner />
}

export default ChangePasswordPage;