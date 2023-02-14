import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Paper } from "@mui/material";
import { Box } from "@mui/system";

import { ProfileFormValidation } from "../../validations/profileFormValidation";
import AvatarUploadForm from "../avatarForm/AvatarUploadForm";
import { EmailField, NameField } from "components/fields/userFields";

import { useFetchUpdateUserNameMutation } from "services/userServices";

import { IUser } from "types/userTypes";

import styles from "../profileList.module.scss";

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
        if (name !== user?.name) {
            await updateUser({ name })
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
        <Paper elevation={10} sx={{ my: 2, pb: 1 }}>
            <AvatarUploadForm user={user} />
            <Box
                className={styles.profile__field}
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
                <Box sx={{ my: 4 }}>
                    <NameField
                        label="Change your name"
                        error={errors.name}
                        control={control}
                    />
                </Box>
                <Button type="submit">
                    {isLoading ? 'Loading...' : 'Save name'}
                </Button>
            </Box>
        </Paper>
    )
}

export default ProfileForm;