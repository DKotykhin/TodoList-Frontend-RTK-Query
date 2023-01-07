import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import { Box, Container, Typography, Modal } from "@mui/material";

import SelectTaskCount from './SelectTaskCount';
import PaginationControlled from './PaginationControlled';
import ShortCardList from 'components/card/shortCard/ShortCardList';
import FullCard from 'components/card/fullCard/FullCard';
import Spinner from 'components/spinner/Spinner';
import SnackBar from 'components/snackBar/SnackBar';

import { useFetchAllTasksQuery } from "services/taskServices";

import { setQuery } from "store/querySlice";
import { useAppDispatch, useAppSelector } from "store/hook";
import { useFormQuery } from 'hooks/useFormQuery';

import "./cardList.scss";

interface ICardListNew {
    tabIndex: number;
    searchQuery: string;
    fieldData: string;
    AZData: string;
}

const CardList: React.FC<ICardListNew> = ({ tabIndex, searchQuery, fieldData, AZData }) => {

    const { query: { limit, page } } = useAppSelector((state) => state.query);

    const [totalTasks, setTotalTasks] = useState<string>(limit);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(page);

    const query = useFormQuery({
        totalTasks,
        currentPageNumber,
        tabIndex,
        searchQuery,
        fieldData,
        AZData
    });

    const [cardFullOpen, setCardFullOpen] = useState(false);
    const [cardFullId, setCardFullId] = useState("");

    const [succsessMessageHook, setSuccsessMessageHook] = useState("");
    const [errorMessageHook, setErrorMessageHook] = useState("");

    const dispatch = useAppDispatch();

    const { data, isSuccess, isError, isFetching } = useFetchAllTasksQuery(query);
    const taskdata = data?.tasks ? data.tasks : [];
    const fullCard = taskdata.filter((task) => task._id === cardFullId)[0];

    useEffect(() => {
        if (data?.tasksOnPageQty === 0) {
            setCurrentPageNumber(prev => prev - 1);
        }
    }, [data?.tasksOnPageQty]);

    useEffect(() => {
        setCurrentPageNumber(1);
    }, [tabIndex]);

    useEffect(() => {
        dispatch(setQuery({ query }));
    }, [dispatch, query]);

    const handleTotalTasks = (data: string) => {
        setTotalTasks(data);
    };

    const handleCurrentPageNumber = (value: number) => {
        setCurrentPageNumber(value);
    };

    const handleOpenFullCard = (data: string): void => {
        setCardFullOpen(true);
        setCardFullId(data);
    };

    const cardFullClose = (): void => {
        setCardFullOpen(false);
    };

    const successMessage = (data: string): void => {
        setSuccsessMessageHook(data);
    };

    const errorMessage = (data: string): void => {
        setErrorMessageHook(data);
    };

    if (isFetching) return <Spinner />;

    return isSuccess ? (
        <Container className="cardList" maxWidth="xl">
            <Box className="cardList cardListBox">
                <Modal open={cardFullOpen} onClose={cardFullClose}>
                    <Box sx={{ boxShadow: 24 }} className='cardList fullCard'>
                        <FullCard
                            task={fullCard}
                            successMessage={successMessage}
                            errorMessage={errorMessage}
                            closeModal={cardFullClose}
                        />
                    </Box>
                </Modal>
                <Typography className="cardList subtitle">
                    {taskdata.length
                        ? `Total amount: ${taskdata.length}`
                        : "No cards"}
                </Typography>
                <ShortCardList taskdata={taskdata} handleOpenFullCard={handleOpenFullCard} />
            </Box>
            <Box className="cardList taskAmountBox" >
                <Typography className="cardList taskAmount" >tasks on page:</Typography>
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
            <SnackBar successMessage={succsessMessageHook} errorMessage={errorMessageHook} />
        </Container>
    ) : isError ? <Navigate to='/login' /> : <Spinner />
}

export default CardList;
