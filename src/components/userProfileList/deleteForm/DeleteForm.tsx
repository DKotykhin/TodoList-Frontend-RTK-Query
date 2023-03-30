import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Typography, Paper } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import ChildModal from "components/childModal/ChildModal";

import { useFetchDeleteUserMutation } from "services/userServices";
import { fetchUser } from "services/userServices";

import { useAppDispatch } from "store/reduxHooks";
import { logout } from "store/userSlice";

import styles from "./deleteForm.module.scss";

const DeleteForm: React.FC = () => {

    const [openChildModal, setOpenChildModal] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [deleteUser, { isLoading }] = useFetchDeleteUserMutation();

    const handleSubmit = async () => {
        setOpenChildModal(false);
        await deleteUser()
            .unwrap()
            .then(response => {
                console.log(response.message);
                dispatch(fetchUser.util.resetApiState());
                dispatch(logout());
                sessionStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberMe");
                navigate("/login");
            })
            .catch((error) => {
                toast.error(error.data.message);
            })
    };

    const handleClick = (): void => {
        setOpenChildModal(true);
    };
    const handleClose = (): void => {
        setOpenChildModal(false);
    };

    return (
        <Paper elevation={10} className={styles.deleteForm}>
            <Typography className={styles.deleteForm__title}>
                {isLoading ? 'Deleting...' : 'Need to delete Profile?'}
            </Typography>
            <DeleteForeverIcon onClick={handleClick} className={styles.deleteForm__icon} />
            <ChildModal
                open={openChildModal}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                title={'user'}
            />
        </Paper>
    )
}

export default DeleteForm;