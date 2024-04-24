import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

type UserAuthState = {
  degencastId: string | number;
  justRegistered: boolean;
};

const userAuthState: UserAuthState = {
  degencastId: "",
  justRegistered: false,
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: userAuthState,
  reducers: {
    setDegencastId: (
      state: UserAuthState,
      action: PayloadAction<string | number>,
    ) => {
      state.degencastId = action.payload;
    },
    clearDegencastId: (state: UserAuthState) => {
      state.degencastId = "";
    },
    setJustRegistered: (
      state: UserAuthState,
      action: PayloadAction<boolean>,
    ) => {
      state.justRegistered = action.payload;
    },
  },
});

const { actions, reducer } = userAuthSlice;
export const { setDegencastId, clearDegencastId, setJustRegistered } = actions;
export const selectUserAuth = (state: RootState) => state.userAuth;
export default reducer;
