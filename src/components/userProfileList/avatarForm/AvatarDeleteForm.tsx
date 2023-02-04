import React from 'react';
import { toast } from 'react-toastify';

import DeleteDialog from "../deleteDialog/DeleteDialog";

import { useFetchDeleteAvatarMutation } from "services/userServices";

import { IUser } from 'types/userTypes';

const AvatarDeleteForm: React.FC<{ user?: IUser }> = ({ user }) => {

    const [deleteAvatar] = useFetchDeleteAvatarMutation();

    const handleDelete = async () => {
        const avatarURL: string | undefined = user?.avatarURL;
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
    }

    return (
        <>
            <DeleteDialog
                dialogTitle={"You really want to delete avatar?"}
                deleteAction={handleDelete}
            />
        </>
    )
}

export default AvatarDeleteForm;