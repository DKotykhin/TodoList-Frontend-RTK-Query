import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";

import { fetchUser } from "services/userServices";
import { useAppDispatch } from "store/reduxHooks";
import { logout } from "store/userSlice";

import styles from "./navBar.module.scss";

const menu = ["Profile", "Change password", "Logout"];

const NavBarMenu = () => {    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSettingMenu = (event: string): void => {
        switch (event) {
            case menu[0]:                
                navigate("/profile");
                break;
            case menu[1]:
                navigate("/password");
                break;
            case menu[2]:
                dispatch(fetchUser.util.resetApiState());
                dispatch(logout());
                sessionStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberMe");
                navigate("/login");
                break;
            default:
                navigate("/");
        }
    };

    return (
        <>
            {menu.map((item) => (
                <Typography
                    key={item}
                    className={styles.navbar__menu}
                    onClick={() => handleSettingMenu(item)}
                >
                    {item}
                </Typography>
            ))}
        </>
    );
};

export default NavBarMenu;
