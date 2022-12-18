import React from 'react';
import { Navigate } from "react-router-dom";
import Helmet from "react-helmet";

import TabPanelComponent from "components/tabPanel/TabPanel";
import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/isAuth";

const HomePage: React.FC = () => {

    const auth = useAuth();

    return auth.isSuccess ? (
        <>
            <Helmet>
                <meta name="description" content="Home Page" />
                <title>Home Page</title>
            </Helmet>
            <TabPanelComponent />
        </>
    ) : auth.isError ? <Navigate to="/login" /> : <Spinner />
}

export default HomePage;