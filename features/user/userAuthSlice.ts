import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { AsyncRequestStatus } from "~/services/shared/types";

type UserAuthState = {
  degencastId: string | number;
  degencastLoginRequestStatus: AsyncRequestStatus;
};

const userAuthState: UserAuthState = {
  degencastId: "",
  degencastLoginRequestStatus: AsyncRequestStatus.IDLE,
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
    setDegencastLoginRequestStatus: (
      state: UserAuthState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.degencastLoginRequestStatus = action.payload;
    },
  },
});

const { actions, reducer } = userAuthSlice;
export const {
  setDegencastId,
  clearDegencastId,
  setDegencastLoginRequestStatus,
} = actions;
export const selectUserAuth = (state: RootState) => state.userAuth;
export default reducer;
