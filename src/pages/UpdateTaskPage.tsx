import React from "react";
import { Navigate } from "react-router-dom";
import Helmet from "react-helmet";

import UpdateTaskComponent from "components/taskForms/UpdateTask";
import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/isAuth";

const UpdateTaskPage: React.FC = () => {

    const auth = useAuth();

    return auth.isSuccess ? (
        <>
            <Helmet>
                <meta name="description" content="Update Task Page" />
                <title>Update Task Page</title>
            </Helmet>
            <UpdateTaskComponent />
        </>
    ) : auth.isError ? <Navigate to="/login" /> : <Spinner />
};

export default UpdateTaskPage;
