import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { Box, Tab, Tabs, Container } from "@mui/material";

import CardList from "components/cardList/CardList";
import Spinner from "components/spinner/Spinner";
import PaginationControlled from "./PaginationControlled";

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
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    const { data, isSuccess, isError } = useFetchAllTasksQuery({ limit: 6, page: currentPageNumber });
    const allTasks = data?.tasks ? data.tasks : [];
    const activeTasks = data?.tasks ? data.tasks.filter((task: ITask) => task.completed === false) : [];
    const completedTasks = data?.tasks ? data.tasks.filter((task: ITask) => task.completed === true) : [];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const currentPage = (value: number) => {
        setCurrentPageNumber(value);
    };

    return isSuccess ? (
        <Container maxWidth="xl">
            <Box sx={{ minHeight: 'calc(100vh - 230px)'}}>
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
            </Box>
            <Box>
                {data?.totalPagesQty > 1 &&
                    <PaginationControlled
                        totalPagesQty={data?.totalPagesQty}
                        currentPage={currentPage}
                        currentPageNumber={currentPageNumber} />
                }
            </Box>
        </Container>
    ) : isError ? <Navigate to='/login' /> : <Spinner />

};

export default TabPanelComponent;
