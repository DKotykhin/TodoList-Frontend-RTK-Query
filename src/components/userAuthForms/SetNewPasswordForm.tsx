import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Container, Typography, Box, Avatar, Paper } from "@mui/material";

import { PasswordField } from "components/fields/userFields";
import { NewPasswordFormValidation } from "components/validations/userFormValidation";

import { useFetchUserSetNewPasswordMutation } from 'services/userServices';

import styles from "./form.module.scss";

interface IPasswordData {
    newpassword: string;
    confirmpassword: string
}

const SetNewPasswordForm: React.FC = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    const [setNewPassword, { isLoading }] = useFetchUserSetNewPasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<IPasswordData>(NewPasswordFormValidation);

    const onSubmit = async (data: IPasswordData) => {
        if (data.newpassword === data.confirmpassword) {
            const { newpassword } = data;
            await setNewPassword({ password: newpassword.trim(), token })
                .unwrap()
                .then(response => {
                    // console.log(response.message);
                    navigate("/login");
                    toast.success(response.message);
                    reset();
                })
                .catch(error => toast.error(error.data.message))
        } else {
            toast.warn("Passwords don't match");
        }
    };

    return (
        <Container maxWidth="xs" className={styles.form}>
            <Paper elevation={10} className={styles.form__paper}>
                <Typography className={styles.form__title} component="h2">
                    {"Set New Password Form"}
                </Typography>
                <Avatar className={styles.form__avatar} />
                <Box
                    component="form"
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
                        className={styles.form__submit_button}
                        disabled={!isValid}
                        type="submit"
                    >
                        {isLoading ? 'Loading...' : 'Send'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default SetNewPasswordForm;