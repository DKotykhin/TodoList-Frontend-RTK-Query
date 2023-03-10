import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from "react-router-dom";

import { Box, Container, Typography, Modal } from "@mui/material";

import SelectTaskCount from './SelectTaskCount';
import PaginationControlled from './PaginationControlled';
import ShortCardList from 'components/card/shortCard/ShortCardList';
import FullCard from 'components/card/fullCard/FullCard';
import Spinner from 'components/spinner/Spinner';

import { useFetchAllTasksQuery } from "services/taskServices";
import { querySelector, setQuery } from "store/querySlice";
import { useAppDispatch, useAppSelector } from "store/reduxHooks";

import { IQueryData } from 'types/taskTypes';

import styles from "./cardList.module.scss";

interface ICardListNew {
    tabIndex: number;
    searchQuery: string;
    fieldValue: string;
    AZValue: number;
}

const CardList: React.FC<ICardListNew> = ({ tabIndex, searchQuery, fieldValue, AZValue }) => {

    const { query: { limit, page } } = useAppSelector(querySelector);

    const [tasksOnPage, setTasksOnPage] = useState(limit);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(page);

    const [cardFullOpen, setCardFullOpen] = useState(false);
    const [cardFullId, setCardFullId] = useState("");

    const dispatch = useAppDispatch();

    const query: IQueryData = useMemo(
        () => ({
            limit: tasksOnPage,
            page: currentPageNumber,
            tabKey: tabIndex,
            sortField: fieldValue,
            sortOrder: AZValue,
            search: searchQuery,
        }),
        [
            currentPageNumber,
            searchQuery,
            fieldValue,
            AZValue,
            tabIndex,
            tasksOnPage,
        ]
    );


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

    const handleTasksOnPage = (data: number) => {
        setTasksOnPage(data);
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

    if (isFetching) return <Spinner />;

    return isSuccess ? (
        <Container maxWidth="xl" className={styles.cardList}>
            <Modal open={cardFullOpen} onClose={cardFullClose}>
                <>
                    <FullCard
                        task={fullCard}
                        closeModal={cardFullClose}
                    />
                </>
            </Modal>
            <Typography className={styles.cardList__subtitle}>
                {data.totalTasksQty
                    ? `On page: ${data.tasksOnPageQty}, total: ${data.totalTasksQty}`
                    : "No cards"}
            </Typography>
            <Box className={styles.cardList__box}>
                <ShortCardList taskdata={taskdata} handleOpenFullCard={handleOpenFullCard} />
            </Box>
            <Box className={styles.cardList__taskAmountBox} >
                <Typography className={styles.cardList__taskAmount} >tasks on page:</Typography>
                <SelectTaskCount tasksOnPage={tasksOnPage} setTasksOnPage={handleTasksOnPage} />
            </Box>
            {data?.totalPagesQty > 1 &&
                <PaginationControlled
                    totalPagesQty={data?.totalPagesQty}
                    currentPage={handleCurrentPageNumber}
                    currentPageNumber={currentPageNumber} />
            }
        </Container>
    ) : isError ? <Navigate to='/login' /> : <Spinner />
}

export default CardList;
