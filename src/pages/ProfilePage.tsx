import React from "react";
import Helmet from "react-helmet";
import { Navigate } from "react-router-dom";

import ProfileList from "components/userProfileList/ProfileList";
import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/isAuth";

const ProfilePage: React.FC = () => {

    const auth = useAuth();    

    return auth.isSuccess ? (
        <>
            <Helmet>
                <meta name="description" content="Profile Page" />
                <title>Profile Page</title>
            </Helmet>
            <ProfileList />
        </>
    ) : auth.isError ? <Navigate to="/login" /> : <Spinner />
};

export default ProfilePage;
