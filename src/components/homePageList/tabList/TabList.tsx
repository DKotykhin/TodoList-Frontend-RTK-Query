import React from 'react';

import { Box } from "@mui/material";
import CardList from 'components/cardList/CardList';

import PropTypes from "prop-types";
import { IGetTasksResponse } from 'types/responseTypes';

interface ITabList {
    tabIndex: number;
    taskdata: IGetTasksResponse;
}
interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
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
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const TabList: React.FC<ITabList> = ({ tabIndex, taskdata }) => {

    return (
        <>
            <TabPanel value={tabIndex} index={0}>
                <CardList taskdata={taskdata} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <CardList taskdata={taskdata} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <CardList taskdata={taskdata} />
            </TabPanel>
        </>
    );
};

export default TabList;