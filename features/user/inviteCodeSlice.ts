import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

type InviteCodeState = {
  usedInviterFid: string | number;
};

const inviteCodeState: InviteCodeState = {
  usedInviterFid: "",
};

export const inviteCodeSlice = createSlice({
  name: "inviteCode",
  initialState: inviteCodeState,
  reducers: {
    setUsedInviterFid: (
      state: InviteCodeState,
      action: PayloadAction<string | number>,
    ) => {
      state.usedInviterFid = action.payload;
    },
    clearUsedInviterFid: (state: InviteCodeState) => {
      state.usedInviterFid = "";
    },
  },
});

const { actions, reducer } = inviteCodeSlice;
export const { setUsedInviterFid, clearUsedInviterFid } = actions;
export const selectInviteCode = (state: RootState) => state.inviteCode;
export default reducer;
