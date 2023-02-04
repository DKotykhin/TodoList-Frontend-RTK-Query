import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Container, Typography, Avatar, Paper } from "@mui/material";
import { Box } from "@mui/system";

import { EmailField, NameField, PasswordField } from "components/fields/userFields";
import { RegisterFormValidation } from "../validations/userFormValidation";
import { useFetchRegisterUserMutation } from "services/userServices";

import { IUserRegister } from "types/userTypes";

import styles from "./form.module.scss";

const RegisterForm = () => {

    const navigate = useNavigate();

    const [registerUser, { isLoading }] = useFetchRegisterUserMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<IUserRegister>(RegisterFormValidation);

    const onSubmit = async (registerData: IUserRegister) => {
        await registerUser(registerData)
            .unwrap()
            .then(response => {
                console.log(response.message);
                sessionStorage.setItem("rememberMe", response.token);
                navigate("/");
                reset();
            })
            .catch((error) => {
                toast.error(error.data.message);
            })
    };

    return (
        <Container maxWidth="xs" className={styles.form}>
            <Paper elevation={10} className={styles.form__paper}>
                <Typography className={styles.paper__title} component="h2">
                    {"Registration"}
                </Typography>
                <Avatar className={styles.paper__avatar} />
                <Box
                    className={styles.paper__field}
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <NameField
                        label='Name'
                        error={errors.name}
                        control={control} />
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
                    <Button
                        disabled={!isValid}
                        type="submit"
                    >
                        {isLoading ? 'Loading...' : "Register"}
                    </Button>
                </Box>
            </Paper>
            <Typography className={styles.form__subtitle}>
                {"Already have account?"}
            </Typography>
            <Button className={styles.form__submit_button} component={Link} to="/login">
                {"Login"}
            </Button>
        </Container>
    );
}

export default RegisterForm;
