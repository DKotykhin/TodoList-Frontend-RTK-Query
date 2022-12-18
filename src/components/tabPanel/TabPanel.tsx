import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { Box, Tab, Tabs, Container } from "@mui/material";

import CardList from "components/cardList/CardList";
import Spinner from "components/spinner/Spinner";

import { useFetchAllTasksQuery } from "services/taskServices";

import PropTypes from "prop-types";
import { ITask } from "types/taskTypes";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const TabPanelComponent: React.FC = () => {
    const [value, setValue] = useState(0);

    const { data, isSuccess, isError } = useFetchAllTasksQuery();
    const allTasks = data ? data : []
    const activeTasks = data ? data.filter((task: ITask) => task.completed === false) : [];
    const completedTasks = data ? data.filter((task: ITask) => task.completed === true) : [];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return isSuccess ? (
        <Container maxWidth="xl">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                >
                    <Tab label="All" {...a11yProps(0)} />
                    <Tab label="Active" {...a11yProps(1)} />
                    <Tab label="Done" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CardList taskdata={allTasks} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CardList taskdata={activeTasks} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CardList taskdata={completedTasks} />
            </TabPanel>
        </Container>
    ) : isError ? <Navigate to='/login' /> : <Spinner />

};

export default TabPanelComponent;
