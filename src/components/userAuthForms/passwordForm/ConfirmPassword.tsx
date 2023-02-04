import React from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Button } from "@mui/material";
import { Box } from "@mui/system";

import { PasswordField } from "components/fields/userFields";
import { PasswordFormValidation } from "../../validations/userFormValidation";
import { useFetchUserConfirmPasswordMutation } from "services/userServices";

import styles from "./password.module.scss";

interface IConfirmPassword {
    confirmStatus: (arg0: boolean) => void;
}

interface IPasswordData {
    currentpassword: string
}

const ConfirmPassword: React.FC<IConfirmPassword> = ({ confirmStatus }) => {

    const [confirmPassword, { isLoading }] = useFetchUserConfirmPasswordMutation()

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IPasswordData>(PasswordFormValidation);

    const onSubmit = async (data: IPasswordData) => {       
        const { currentpassword } = data;
        await confirmPassword({ password: currentpassword })
            .unwrap()
            .then(response => {
                console.log(response.message);
                if (response.confirmStatus) {
                    confirmStatus(response.confirmStatus)
                } else {
                    toast.error(response.message);
                }
            })
            .catch((error: { data: { message: string }}) => {                
                toast.error(error.data.message);
            })
    }

    return (
        <>
            <Box
                className={styles.form__field}
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <PasswordField
                    name={"Current password"}
                    error={errors.currentpassword}
                    control={control}
                />
                <Button
                    disabled={!isValid}
                    className={styles.form__submit_button}
                    type="submit"
                >
                    {isLoading ? 'Loading...' : "Confirm password"}
                </Button>
            </Box>            
        </>
    )
}

export default ConfirmPassword;
