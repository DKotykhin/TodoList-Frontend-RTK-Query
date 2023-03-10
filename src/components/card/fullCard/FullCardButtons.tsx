import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Button } from "@mui/material";

import { ICompleteTask, ITask } from "types/taskTypes";
import { useFetchDeleteTaskMutation, useFetchUpdateTaskMutation } from "services/taskServices";

interface IFullCardButtons {
    task: ITask;
    closeModal: () => void;
}

const FullCardButtons: React.FC<IFullCardButtons> = ({ task, closeModal }) => {
    const { _id, completed } = task;

    const [updateTask, { isLoading }] = useFetchUpdateTaskMutation();
    const [deleteTask] = useFetchDeleteTaskMutation();

    const navigate = useNavigate();

    const handleDelete = async (_id: string) => {
        closeModal();
        await deleteTask({ _id })
            .unwrap()
            .then((res) => {
                toast.success(res.message)
            })
            .catch((error: { data: { message: string } }) => {
                toast.error(error.data.message);
            })
    };

    const handleUpdate = (id: string): void => {
        navigate(`/updatetask/${id}`);
    };

    const handleComplete = async (data: ITask) => {
        closeModal();
        const { completed, _id, title } = data;
        const newData: ICompleteTask = { completed: !completed, _id, title };
        await updateTask(newData)
            .unwrap()
            .then(res => {
                toast.success(res.message)
            })
            .catch((error: { data: { message: string } }) => {
                toast.error(error.data.message);
            })
    };

    return (
        <>
            <Button
                size="small"
                color="error"
                onClick={() => handleDelete(_id)}
            >
                Delete
            </Button>
            <Button
                size="small"
                color="inherit"
                onClick={() => handleUpdate(_id)}
            >
                Update
            </Button>
            <Button size="small" onClick={() => handleComplete(task)}>
                {isLoading
                    ? "Loading..."
                    : completed
                        ? "Undo Complete"
                        : "Complete"}
            </Button>
        </>
    );
};

export default FullCardButtons;
