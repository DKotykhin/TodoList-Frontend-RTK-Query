import React, { useState } from 'react';
import { useForm, FieldValues } from "react-hook-form";

import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from '@mui/icons-material/FileUpload';

import UserMessage from "components/userMessage/UserMessage";
import AvatarDeleteForm from './AvatarDeleteForm';

import { useFetchUploadAvatarMutation } from "services/userServices";
import { IUser } from 'types/userTypes';

const checkFileType = (type: string): boolean => {
    return (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp');
};
const Base_URL = process.env.REACT_APP_BACKEND_URL;

const AvatarUploadForm: React.FC<{ user?: IUser }> = ({ user }) => {

    const [loadSuccess, setLoadSuccess] = useState('');
    const [loadError, setLoadError] = useState('');
    const [fileName, setFileName] = useState('');
    const { register, reset, handleSubmit } = useForm();

    const [loadAvatar, { isLoading }] = useFetchUploadAvatarMutation();
    const userAvatarURL = user?.avatarURL ? Base_URL + user.avatarURL : "/";

    const onChange = (e: any) => {
        setLoadError('');
        setLoadSuccess('');
        setFileName(e.target.files[0].name);
        const isApproved = checkFileType(e.target.files[0].type);
        if (!isApproved) setLoadError("Incorrect file type");
        if (e.target.files[0].size > 1024000) setLoadError("File shoul be less then 1Mb");
    };
    const onReset = () => {
        setLoadError('')
        setFileName("");
        reset();
    };

    const onSubmit = async (data: FieldValues) => {
        const isApproved = checkFileType(data.avatar[0].type);
        if (!isApproved) {
            setLoadError("Can't upload this type of file");
        } else if (data.avatar[0].size > 1024000) {
            setLoadError("Too large file to upload!");
        } else if (data.avatar.length) {
            const formData = new FormData();
            formData.append("avatar", data.avatar[0], data.avatar[0].name);
            await loadAvatar(formData)
                .unwrap()
                .then(response => {
                    console.log(response.message);
                    setLoadSuccess(response.message);
                    reset();
                    setFileName("");
                })
                .catch((error) => {
                    console.log(error.data.message);
                    setLoadError(error.data.message);
                })
        } else {
            setLoadError("No File in Avatar Field");
        }
    }

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Box sx={{ cursor: 'pointer' }} component="label" onChange={onChange}>
                <Tooltip title="Change Avatar" placement="left" arrow>
                    <Avatar
                        sx={{ width: 150, height: 150, margin: '0 auto' }}
                        src={userAvatarURL}
                    />
                </Tooltip>
                <Box
                    {...register("avatar")}
                    component="input"
                    type="file"
                    hidden
                />
            </Box>
            {fileName ? (
                <>
                    {fileName}
                    <IconButton onClick={onReset}>
                        <Tooltip title="Cancel" placement="top" arrow>
                            <CloseIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton type="submit">
                        <Tooltip title="Upload" placement="top" arrow>
                            <FileUploadIcon color='primary' />
                        </Tooltip>
                    </IconButton>
                </>
            ) : <AvatarDeleteForm user={user} />}
            <UserMessage loading={isLoading} loaded={loadSuccess} error={loadError} />
        </Box>
    )
}

export default AvatarUploadForm