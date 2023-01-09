import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button, Container, Typography, Avatar, Paper } from "@mui/material";
import { Box } from "@mui/system";

import { EmailField, NameField, PasswordField } from "components/userFields";
import { RegisterFormValidation } from "./userFormValidation";
import { useFetchRegisterUserMutation } from "services/userServices";

import { IUserRegister } from "types/userTypes";

import "./styleForm.scss";

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
        <Container maxWidth="xs" className="form">
            <Paper elevation={10} className="form paper">
                <Typography className="form title" component="h2">
                    {"Registration"}
                </Typography>
                <Avatar className="form avatar" />
                <Box
                    className="form field"
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
                        className="form submit_button"
                        type="submit"
                    >
                        {isLoading ? 'Loading...' : "Register"}
                    </Button>
                </Box>
            </Paper>
            <Typography className="form subtitle">
                {"Already have account?"}
            </Typography>
            <Button className="form submit_button" component={Link} to="/login">
                {"Login"}
            </Button>
        </Container>
    );
}

export default RegisterForm;
