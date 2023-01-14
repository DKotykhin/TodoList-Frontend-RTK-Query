import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./reduxHooks";

import { IUser } from "types/userTypes";

const initialState: IUser = {
    _id: "",
    email: "",
    name: "",
    createdAt: "",
    avatarURL: "",
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: () => initialState,
        setUserAvatar: (state, action: PayloadAction<IUser>) => {
            state.name = action.payload.name;
            state.avatarURL = action.payload.avatarURL;
        },
    },
});

const { actions, reducer } = UserSlice;

export default reducer;
export const { setUserAvatar, logout } = actions;

export const userSelector = (state: RootState) => state.user;
