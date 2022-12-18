import React from "react";
import { Navigate } from "react-router-dom";
import Helmet from "react-helmet";

import AddTaskComponent from "components/taskForms/AddTask";
import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/isAuth";

const AddTaskPage: React.FC = () => {

    const auth = useAuth();

    return auth.isSuccess ? (
        <>
            <Helmet>
                <meta name="description" content="Add Task Page" />
                <title>Add Task Page</title>
            </Helmet>
            <AddTaskComponent />
        </>
    ) : auth.isError ? <Navigate to="/login" /> : <Spinner />
};

export default AddTaskPage;