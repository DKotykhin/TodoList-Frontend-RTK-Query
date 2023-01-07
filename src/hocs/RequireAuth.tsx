import { useLocation, Navigate } from 'react-router-dom';

import Spinner from "components/spinner/Spinner";

import { useAuth } from "hooks/useAuth";
import { getToken } from 'services/getToken';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();

    if (!getToken()) {
        return <Navigate to="/login" />
    }

    if (!auth.isSuccess) {
        return auth.isError ? <Navigate to='/login' state={{ from: location }} /> : <Spinner />
    }

    return children;
}

export { RequireAuth };