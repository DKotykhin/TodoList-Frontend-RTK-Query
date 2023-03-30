import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Button } from "@mui/material";

import ChildModal from "components/childModal/ChildModal";

import { ICompleteTask, ITask } from "types/taskTypes";
import { useFetchDeleteTaskMutation, useFetchUpdateTaskMutation } from "services/taskServices";

interface IFullCardButtons {
    task: ITask;
    closeModal: () => void;
}

const FullCardButtons: React.FC<IFullCardButtons> = ({ task, closeModal }) => {
    const { _id, completed } = task;

    const [openChildModal, setOpenChildModal] = useState(false);

    const [updateTask, { isLoading }] = useFetchUpdateTaskMutation();
    const [deleteTask] = useFetchDeleteTaskMutation();

    const navigate = useNavigate();

    const handleDelete = async (_id: string) => {
        setOpenChildModal(true);
    };

    const handleUpdate = (task: ITask): void => {
        if (!task.completed) {
            navigate(`/updatetask/${task._id}`);
        } else toast.warn("You can't update completed task!");
    };

    const handleComplete = async (task: ITask) => {
        closeModal();
        const { completed, _id, title } = task;
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

    const handleClose = (): void => {
        setOpenChildModal(false);
    };
    const handleSubmit = async () => {
        setOpenChildModal(false);
        await deleteTask({ _id })
            .unwrap()
            .then((res) => {
                closeModal();
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
                onClick={() => handleUpdate(task)}
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
            <ChildModal
                open={openChildModal}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                title={'task'}
            />
        </>
    );
};

export default FullCardButtons;
