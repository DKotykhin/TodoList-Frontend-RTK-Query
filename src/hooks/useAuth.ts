import { getToken } from "services/getToken";
import { useFetchUserByTokenQuery } from "services/userServices";

export const useAuth = (): { isSuccess: boolean; isError: boolean } => {
    const { isSuccess, isError } = useFetchUserByTokenQuery(undefined, {
        skip: !getToken(),
    });

    return { isSuccess, isError };
};
