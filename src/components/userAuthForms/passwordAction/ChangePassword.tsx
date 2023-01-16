import React from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button } from "@mui/material";
import { Box } from "@mui/system";

import { PasswordField } from "components/userFields";
import { NewPasswordFormValidation } from "../userFormValidation";
import { useFetchUpdateUserPasswordMutation } from "services/userServices";

import "../styleForm.scss";

interface IPasswordData {
    newpassword: string;
    confirmpassword: string
}

const ChangePassword: React.FC = () => {

    const [updatePassword, { isLoading }] = useFetchUpdateUserPasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<IPasswordData>(NewPasswordFormValidation);

    const onSubmit = async (data: IPasswordData) => {
        if (data.newpassword === data.confirmpassword) {
            const { newpassword } = data;
            await updatePassword({ password: newpassword })
                .unwrap()
                .then(response => {
                    console.log(response.message);
                    toast.success('Password successfully changed!');
                    reset();
                })
                .catch((error: { data: { message: string } }) => {
                    toast.error(error.data.message);
                })
        } else {
            toast.warn("Passwords don't match");
        }
    };

    return (
        <>
            <Box
                className="form field"
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <PasswordField
                    name={"New password"}
                    error={errors.newpassword}
                    control={control}
                />
                <PasswordField
                    name={"Confirm password"}
                    error={errors.confirmpassword}
                    control={control}
                />
                <Button
                    disabled={!isValid}
                    className="form submit_button"
                    type="submit"
                >
                    {isLoading ? 'Loading...' : "Change password"}
                </Button>
            </Box>
        </>
    );
}

export default ChangePassword;