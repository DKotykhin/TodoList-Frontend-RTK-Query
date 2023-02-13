import React from "react";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { Button, Typography, Container, Paper } from "@mui/material";

import DeleteForm from "./deleteForm/DeleteForm";
import ProfileForm from "./profileForm/ProfileForm";

import { useFetchUserByTokenQuery } from "services/userServices";

import styles from "./profileList.module.scss";

const ProfileList: React.FC = () => {

    const navigate = useNavigate();
    const { data } = useFetchUserByTokenQuery();

    return (
        <Container maxWidth="xs" className={styles.profile}>
            <Paper elevation={10} className={styles.profile__paper}>
                <Typography className={styles.profile__title} component="h2">
                    {data?.name}
                </Typography>
                <Typography sx={{ pb: 1 }}>
                    {data && `Created: ${format(
                        new Date(data.createdAt),
                        "dd LLL yyyy 'at' H:mm"
                    )}`}
                </Typography>
            </Paper>
            <ProfileForm user={data} />
            <DeleteForm />
            <Button sx={{ m: 6 }} onClick={() => navigate("/")}>
                Main Page
            </Button>
        </Container>
    )
};

export default ProfileList;
