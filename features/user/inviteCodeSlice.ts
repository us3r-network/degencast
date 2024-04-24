import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

type InviteCodeState = {
  usedOtherInviteFid: string | number;
};

const inviteCodeState: InviteCodeState = {
  usedOtherInviteFid: "",
};

export const inviteCodeSlice = createSlice({
  name: "inviteCode",
  initialState: inviteCodeState,
  reducers: {
    setUsedOtherInviteFid: (
      state: InviteCodeState,
      action: PayloadAction<string | number>,
    ) => {
      state.usedOtherInviteFid = action.payload;
    },
    clearUsedOtherInviteFid: (state: InviteCodeState) => {
      state.usedOtherInviteFid = "";
    },
  },
});

const { actions, reducer } = inviteCodeSlice;
export const { setUsedOtherInviteFid, clearUsedOtherInviteFid } = actions;
export const selectInviteCode = (state: RootState) => state.inviteCode;
export default reducer;
