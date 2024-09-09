import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { InvitationCodeRespEntity } from "~/services/user/types";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { getMyInvitationCodes } from "~/services/user/api";

type InviteCodeState = {
  usedInviterFid: string | number;
  invitationCodes: Array<InvitationCodeRespEntity>;
  invitationCodesRequestStatus: AsyncRequestStatus;
};

const inviteCodeState: InviteCodeState = {
  usedInviterFid: "",
  invitationCodes: [],
  invitationCodesRequestStatus: AsyncRequestStatus.IDLE,
};

export const fetchMyInvitationCodes = createAsyncThunk(
  "inviteCode/fetchMyInvitationCodes",
  async () => {
    const res = await getMyInvitationCodes();
    const { code, data } = res.data;
    if (code === ApiRespCode.SUCCESS) {
      return data;
    }
    throw new Error("Failed to fetch invitation codes");
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { inviteCode } = state;
      const { invitationCodesRequestStatus } = inviteCode;
      if (invitationCodesRequestStatus === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  },
);

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
    clearInvitationCodes: (state: InviteCodeState) => {
      state.invitationCodes = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMyInvitationCodes.pending, (state, action) => {
        state.invitationCodesRequestStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchMyInvitationCodes.fulfilled, (state, action) => {
        state.invitationCodesRequestStatus = AsyncRequestStatus.FULFILLED;
        state.invitationCodes = action.payload;
      })
      .addCase(fetchMyInvitationCodes.rejected, (state, action) => {
        state.invitationCodesRequestStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = inviteCodeSlice;
export const { setUsedInviterFid, clearUsedInviterFid, clearInvitationCodes } =
  actions;
export const selectInviteCode = (state: RootState) => state.inviteCode;
export default reducer;
