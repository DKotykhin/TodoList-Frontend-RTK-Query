import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Typography, Paper } from "@mui/material";

import DeleteDialog from "../deleteDialog/DeleteDialog";

import { useFetchDeleteUserMutation } from "services/userServices";
import { fetchUser } from "services/userServices";

import { useAppDispatch } from "store/reduxHooks";
import { logout } from "store/userSlice";

import styles from "./deleteForm.module.scss";

const DeleteForm: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [deleteUser, { isLoading }] = useFetchDeleteUserMutation();

    const handleDelete = async () => {      
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

    return (
        <Paper elevation={10} className={styles.deleteForm}>
            <Typography className={styles.deleteForm__title}>
                {isLoading ? 'Deleting...' : 'Need to delete Profile?'}
            </Typography>            
            <DeleteDialog
                dialogTitle={"You really want to delete user?"}
                deleteAction={handleDelete}
            />
        </Paper>
    )
}

export default DeleteForm;