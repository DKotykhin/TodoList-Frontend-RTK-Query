import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Container, Typography, Box, Avatar, Paper } from "@mui/material";
import { InputLabel, Checkbox } from "@mui/material";

import { EmailField, PasswordField } from "components/fields/userFields/_index";
import { LoginFormValidation } from "validations/userFormValidation";

import { IUserLogin } from "types/userTypes";
import { useFetchLoginUserMutation } from "services/userServices";

import styles from "./form.module.scss";

interface IUserData extends IUserLogin {
    rememberMe: boolean
}

const LoginForm: React.FC = () => {

    const navigate = useNavigate();
    const [fetchLogin, { isLoading }] = useFetchLoginUserMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<IUserData>(LoginFormValidation);


    const onSubmit = async (formdata: IUserData): Promise<void> => {
        const { email, password } = formdata;
        const validData = {
            email: email.trim(),
            password: password.trim(),
        };
        await fetchLogin(validData)
            .unwrap()
            .then(response => {
                // console.log(response.message);
                const { token } = response;
                if (formdata.rememberMe) {
                    localStorage.setItem("rememberMe", token);
                }
                sessionStorage.setItem("rememberMe", token);
                navigate("/");
                reset();
            })
            .catch((error) => {
                toast.error(error.data.message);
            });
    };

    const forgotClick = () => navigate('/reset');

    return (
        <Container maxWidth="xs" className={styles.form}>
            <Paper elevation={10} className={styles.form__paper}>
                <Typography className={styles.form__title} component="h2">
                    {"Login"}
                </Typography>
                <Avatar className={styles.form__avatar} />
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <EmailField
                        disabled={false}
                        error={errors.email}
                        control={control}
                    />
                    <PasswordField
                        name={"Password"}
                        error={errors.password}
                        control={control}
                    />
                    <Typography
                        className={styles.form__forgot}
                        onClick={forgotClick}
                    >
                        Forgot your password?
                    </Typography>
                    <InputLabel className={styles.form__checkbox}>
                        <Controller
                            name="rememberMe"
                            control={control}
                            render={({ field }) => <Checkbox {...field} />}
                            defaultValue={false}
                        />
                        Remember me
                    </InputLabel>
                    <Button
                        className={styles.form__submit_button}
                        disabled={!isValid}
                        type="submit"
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                </Box>
            </Paper>
            <Typography className={styles.form__subtitle}>
                {"Don't have account?"}
            </Typography>
            <Button
                className={styles.form__return_button}
                component={Link}
                to="/registration"
            >
                Registration
            </Button>
        </Container>
    );
};

export default LoginForm;
