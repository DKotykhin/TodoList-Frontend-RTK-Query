import React from "react";

import { Typography, Paper, Box } from "@mui/material";

import { useFetchGetStatisticQuery } from "services/userServices";

import styles from "./userStatistic.module.scss";


const UserStatistic: React.FC = () => {

    const { data, isLoading } = useFetchGetStatisticQuery();

    return (
        <Paper elevation={10} className={styles.statistic}>
            {isLoading ?
                <Typography className={styles.title}>
                    {"Loading..."}
                </Typography> :
                <>
                    <Typography className={styles.title}>
                        {"Your statistic:"}
                    </Typography>
                    {data?.totalTasks ?
                        <Box className={styles.subtitle}>
                            <Box className={styles.box}>
                                <Typography>
                                    {"Total tasks:"}
                                </Typography>
                                <Typography>
                                    {data.totalTasks}
                                </Typography>
                            </Box>
                            <Box className={styles.box}>
                                <Typography>
                                    {"Active tasks:"}
                                </Typography>
                                <Typography>
                                    {data.activeTasks}
                                </Typography>
                            </Box>
                            <Box
                                className={styles.box}
                                sx={data.overdueTasks ? { color: '#ff0000' } : null}
                            >
                                <Typography>
                                    {"Overdue tasks:"}
                                </Typography>
                                <Typography>
                                    {data.overdueTasks}
                                </Typography>
                            </Box>
                            <Box
                                className={styles.box}
                                sx={data.completedTasks ? { color: '#00a1b6' } : null}
                            >
                                <Typography>
                                    {"Completed tasks:"}
                                </Typography>
                                <Typography>
                                    {data.completedTasks}
                                </Typography>
                            </Box>
                        </Box>
                        :
                        <Typography className={styles.text}>
                            {"You don't have any task..."}
                        </Typography>
                    }
                </>
            }
        </Paper>
    )
}

export default UserStatistic;