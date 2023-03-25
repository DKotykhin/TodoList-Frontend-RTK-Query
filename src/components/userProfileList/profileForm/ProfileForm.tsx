import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Paper } from "@mui/material";
import { Box } from "@mui/system";

import { ProfileFormValidation } from "components/validations/userFormValidation";
import { EmailField, NameField } from "components/fields/userFields";
import AvatarUploadForm from "../avatarForm/AvatarUploadForm";

import { useFetchUpdateUserNameMutation } from "services/userServices";

import { IUser } from "types/userTypes";

import styles from "./profileForm.module.scss";

const ProfileForm: React.FC<{ user?: IUser }> = ({ user }) => {

    const [updateUser, { isLoading }] = useFetchUpdateUserNameMutation();

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm(ProfileFormValidation);

    useEffect(() => {
        reset({ name: user?.name, email: user?.email });
    }, [reset, user?.name, user?.email]);

    const onSubmit = async (updateData: FieldValues) => {
        const { name } = updateData;
        const validName = name.trim();
        if (validName !== user?.name) {
            await updateUser({ name: validName })
                .unwrap()
                .then(response => {
                    toast.success(response.message);
                })
                .catch((error) => {
                    toast.error(error.data.message);
                })

        } else toast.warn('The same name!');
    };

    return (
        <Paper elevation={10} className={styles.profileForm}>
            <AvatarUploadForm user={user} />
            <Box
                onSubmit={handleSubmit(onSubmit)}
                component="form"
                noValidate
                autoComplete="off"
            >
                <EmailField
                    disabled={true}
                    error={errors.email}
                    control={control}
                />
                <NameField
                    label="Change your name"
                    error={errors.name}
                    control={control}
                />
                <Button type="submit" className={styles.profileForm__submit_button}>
                    {isLoading ? 'Loading...' : 'Save name'}
                </Button>
            </Box>
        </Paper>
    )
}

export default ProfileForm;