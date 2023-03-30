import React, { useState } from 'react';
import { toast } from 'react-toastify';

import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import ChildModal from "components/childModal/ChildModal";

import { useFetchDeleteAvatarMutation } from "services/userServices";

import styles from './avatarForm.module.scss';

const AvatarDeleteForm: React.FC<{ avatarURL?: string }> = ({ avatarURL }) => {

    const [openChildModal, setOpenChildModal] = useState(false);

    const [deleteAvatar, { isLoading }] = useFetchDeleteAvatarMutation();

    const handleSubmit = async () => {
        setOpenChildModal(false);
        if (avatarURL) {
            await deleteAvatar()
                .unwrap()
                .then(response => {
                    toast.success(response.message);
                })
                .catch((error) => {
                    toast.error(error.data.message);
                })
        } else {
            toast.warn("Avatar doesn't exist");
        }
    };

    const handleClick = (): void => {
        setOpenChildModal(true);
    };
    const handleClose = (): void => {
        setOpenChildModal(false);
    };

    return (
        <>
            {isLoading ?
                <Typography className={styles.avatarForm__loading}>
                    Loading...
                </Typography> :
                <DeleteForeverIcon onClick={handleClick} className={styles.deleteForm__icon} />
            }
            <ChildModal
                open={openChildModal}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                title={'avatar'}
            />
        </>
    )
}

export default AvatarDeleteForm;