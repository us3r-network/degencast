import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { WarpcastChannel } from "~/services/community/api/community";
import { AsyncRequestStatus } from "~/services/shared/types";

type WarpcastChannelState = {
  warpcastChannels: WarpcastChannel[];
  warpcastChannelsRequestStatus: AsyncRequestStatus;
};

const warpcastChannelState: WarpcastChannelState = {
  warpcastChannels: [],

  warpcastChannelsRequestStatus: AsyncRequestStatus.IDLE,
};

export const warpcastChannelsSlice = createSlice({
  name: "warpcastChannels",
  initialState: warpcastChannelState,
  reducers: {
    setWarpcastChannels: (
      state: WarpcastChannelState,
      action: PayloadAction<WarpcastChannel[]>,
    ) => {
      state.warpcastChannels = action.payload;
    },

    setWarpcastChannelsRequestStatus: (
      state: WarpcastChannelState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.warpcastChannelsRequestStatus = action.payload;
    },
  },
});

const { actions, reducer } = warpcastChannelsSlice;
export const { setWarpcastChannels, setWarpcastChannelsRequestStatus } =
  actions;
export const selectWarpcastChannels = (state: RootState) =>
  state.warpcastChannels;
export default reducer;
