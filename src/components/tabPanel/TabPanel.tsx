import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Box, Tab, Tabs, Container, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import CardList from "components/cardList/CardList";
import Spinner from "components/spinner/Spinner";
import PaginationControlled from "./PaginationControlled";
import SelectTaskCount from "./SelectTaskCount";

import { useFetchAllTasksQuery } from "services/taskServices";
import { useAppDispatch } from "store/hook";
import { setQuery } from "store/querySlice";

import PropTypes from "prop-types";

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
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [totalTasks, setTotalTasks] = useState('6');

    const dispatch = useAppDispatch();

    const { data, isSuccess, isError } = useFetchAllTasksQuery({ limit: parseInt(totalTasks), page: currentPageNumber, key: value });
    const tasks = data?.tasks ? data.tasks : [];

    useEffect(() => {
        if (data?.tasksOnPageQty === 0) {
            setCurrentPageNumber(prev => prev - 1);
        }
    }, [data?.tasksOnPageQty]);

    useEffect(() => {
        setCurrentPageNumber(1);
    }, [value]);

    useEffect(() => {
        const queryData = { limit: parseInt(totalTasks), page: currentPageNumber, key: value };
        dispatch(setQuery({ query: queryData }))
    }, [currentPageNumber, dispatch, totalTasks, value])

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCurrentPageNumber = (value: number) => {
        setCurrentPageNumber(value);
    };
    const handleShowSearchPanel = () => {
        setShowSearchPanel(prev => !prev);
    };

    const handleTotalTasks = (data: string) => {        
        setTotalTasks(data);
    };

    return isSuccess ? (
        <Container maxWidth="xl">
            <Box sx={{ minHeight: 'calc(100vh - 230px)' }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: 'flex', justifyContent: 'space-between' }}>
                    <Tabs
                        value={value}
                        onChange={handleChangeTab}
                    >
                        <Tab label="All" {...a11yProps(0)} />
                        <Tab label="Active" {...a11yProps(1)} />
                        <Tab label="Done" {...a11yProps(2)} />
                    </Tabs>
                    <Box sx={{ color: '#808080', mt: 2 }}>
                        <SearchIcon onClick={handleShowSearchPanel} />
                    </Box>
                </Box>
                <TabPanel value={value} index={0}>
                    <CardList taskdata={tasks} showSearchPanel={showSearchPanel} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <CardList taskdata={tasks} showSearchPanel={showSearchPanel} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <CardList taskdata={tasks} showSearchPanel={showSearchPanel} />
                </TabPanel>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Typography sx={{ mt: 1, mr: 2, color: '#808080' }}>tasks on page:</Typography>
                <SelectTaskCount totalTasks={totalTasks} setTotalTasks={handleTotalTasks} />
            </Box>
            <Box>
                {data?.totalPagesQty > 1 &&
                    <PaginationControlled
                        totalPagesQty={data?.totalPagesQty}
                        currentPage={handleCurrentPageNumber}
                        currentPageNumber={currentPageNumber} />
                }
            </Box>
        </Container>
    ) : isError ? <Navigate to='/login' /> : <Spinner />

};

export default TabPanelComponent;
