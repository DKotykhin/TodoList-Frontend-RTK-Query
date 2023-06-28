import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { format } from "date-fns";

import { Container, Typography, InputLabel, Checkbox } from "@mui/material";
import { Box } from "@mui/system";

import { UpdateTaskFormValidation } from "../validations/taskFormValidation";
import { TitleField, MDEField, SubtitleField, DeadlineField } from "../fields/taskFields/_index";
import Buttons from "./buttons/Buttons";

import { useFetchUpdateTaskMutation, useFetchAllTasksQuery } from "services/taskServices";
import { useAppSelector } from 'store/reduxHooks';
import { querySelector } from "store/querySlice";

import { ITask, IUpdateTask } from "types/taskTypes";

import styles from "./task.module.scss";

interface IUpdateForm {
    title: string;
    subtitle?: string;
    deadline?: string;
    completed: boolean;
}

const UpdateTaskComponent: React.FC = () => {

    const [mdeValue, setMdeValue] = useState("");
    const [singleTask, setSingleTask] = useState<ITask>();

    const { taskId } = useParams();
    const navigate = useNavigate();

    const { query } = useAppSelector(querySelector);

    const { data } = useFetchAllTasksQuery(query);
    const [updateTask, { isLoading }] = useFetchUpdateTaskMutation();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<IUpdateForm>(UpdateTaskFormValidation);

    useEffect(() => {
        const currentTask = data?.tasks.filter((task: ITask) => task._id === taskId);
        if (currentTask?.length) setSingleTask(currentTask[0]);
    }, [data?.tasks, navigate, taskId]);

    const onSubmit = async (data: IUpdateForm) => {
        const { title, subtitle, deadline, completed } = data;
        const totalData: IUpdateTask = {
            _id: singleTask?._id || "",
            title,
            subtitle,
            completed,
            description: mdeValue,
            ...(deadline && { deadline: new Date(deadline).toJSON() }),
        };
        await updateTask(totalData)
            .unwrap()
            .then((data) => {
                toast.success(data.message);
                navigate("/", { replace: true });
            })
            .catch((error: { data: { message: string } }) => {
                toast.error(error.data.message);
            });
    };

    const MDEChange = useCallback((data: string) => {
        setMdeValue(data);
    }, []);

    return (
        <Container className={styles.task} maxWidth="sm">
            <Typography className={styles.task__title}>Update Task</Typography>
            {singleTask &&
                <Box onSubmit={handleSubmit(onSubmit)} component="form">

                    <TitleField register={register} error={errors} value={singleTask.title} />
                    <SubtitleField register={register} value={singleTask.subtitle} />
                    <MDEField MDEChange={MDEChange} description={singleTask.description} autofocus={true} />
                    <DeadlineField register={register} value={format(new Date(singleTask.deadline || ""), "yyyy-LL-dd HH:mm")} />

                    <Box className={styles.task__checkbox}>
                        <Checkbox
                            {...register("completed")}
                            defaultChecked={singleTask.completed}
                        />
                        <InputLabel>Completed</InputLabel>
                    </Box>
                    <Buttons loading={isLoading} />
                </Box>
            }
        </Container>
    );
};

export default UpdateTaskComponent;
