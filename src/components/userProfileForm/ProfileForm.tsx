import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Paper } from "@mui/material";
import { Box } from "@mui/system";

import { ProfileFormValidation } from "./ProfileFormValidation";
import AvatarUploadForm from "./AvatarUploadForm";
import { EmailField, NameField } from "components/userFields";
import UserMessage from "components/userMessage/UserMessage";

import { useFetchUpdateUserMutation } from "services/userServices";
import { IUser, IUserUpdate, RequestError } from "types/userTypes";


const ProfileForm: React.FC<{ user?: IUser }> = ({ user }) => {
  
    const [updateUser, { data: updateData, error, isLoading }] = useFetchUpdateUserMutation();
    const updateError = (error as RequestError)?.data.message;

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm(ProfileFormValidation);
    
    useEffect(() => {
        reset({ name: user?.name, email: user?.email });
    }, [reset, user?.name, user?.email]);

    const onSubmit = async (updateData: IUserUpdate) => {       
        const { name } = updateData;
        await updateUser({ name });            
    };

    return (
        <Paper elevation={10} sx={{ my: 2 }}>
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
                <Box sx={{ my: 4 }}>
                    <NameField
                        label="Change your name"
                        error={errors.name}
                        control={control}
                    />
                </Box>

                <UserMessage loading={isLoading} loaded={updateData?.message} error={updateError} />
                <Button
                    type="submit"
                    variant="outlined"
                    sx={{ m: 3 }}
                >
                    Save name
                </Button>
            </Box>
        </Paper>
    )
}

export default ProfileForm;