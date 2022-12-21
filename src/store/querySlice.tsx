import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IQuery {
    query: {
        limit: number;
        page: number;
        key: number;
    }
}
const initialState: IQuery = {
    query: {
        limit: 0,
        page: 0,
        key: 0
    }
};

const QuerySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<IQuery>) => {
            state.query = action.payload.query;
        },
    },
});

const { actions, reducer } = QuerySlice;

export default reducer;
export const { setQuery } = actions;