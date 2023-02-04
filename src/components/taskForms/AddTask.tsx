import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { Box } from "@mui/system";
import { Container, Typography } from "@mui/material";

import { TitleField, MDEField, SubtitleField, DeadlineField } from "../fields/taskFields";
import { AddTaskFormValidation } from "../validations/taskFormValidation";
import Buttons from "./buttons/Buttons";

import { useFetchAddTaskMutation } from "services/taskServices";

import { IAddTask } from "types/taskTypes";

import styles from "./task.module.scss";

const AddTaskComponent: React.FC = () => {

    const [mdeValue, setMdeValue] = useState("");
    const navigate = useNavigate();

    const [addTask, { isLoading }] = useFetchAddTaskMutation();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<IAddTask>(AddTaskFormValidation);

    const onSubmit = async (data: IAddTask) => {
        const { title, subtitle, deadline } = data;        
        const newData: IAddTask = {
            title,
            subtitle,
            description: mdeValue,
            ...(deadline && { deadline: new Date(deadline).toJSON() }),
            completed: false
        };
        await addTask(newData)
            .unwrap()
            .then((data) => {
                toast.success(data.message)
                navigate("/", { replace: true })
            })
            .catch((error: { data: { message: string } }) => {
                toast.error(error.data.message);
            })
    };

    const MDEChange = useCallback((data: string) => {
        setMdeValue(data);
    }, []);

    return (
        <Container className={styles.task} maxWidth="sm">
            <Typography className={styles.task__title}>Add Task</Typography>
            <Box onSubmit={handleSubmit(onSubmit)} component="form">

                <TitleField register={register} error={errors} value={''} />
                <SubtitleField register={register} value={''} />
                <MDEField MDEChange={MDEChange} />
                <DeadlineField register={register} value={''} />

                <Buttons loading={isLoading} />
            </Box>
        </Container>
    );
};

export default AddTaskComponent;
