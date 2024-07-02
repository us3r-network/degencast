import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserHostChannels } from "~/services/farcaster/api";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

type UserHostChannelsState = {
  fid?: number;
  channels: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  status: AsyncRequestStatus;
  done: boolean;
  error: string | undefined;
};

const initialUserHostChannelsState: UserHostChannelsState = {
  fid: undefined,
  channels: [],
  status: AsyncRequestStatus.IDLE,
  done: false,
  error: undefined,
};

export const getHostChannels = createAsyncThunk(
  "userHostChannels/fetchHostChannels",
  async (fid: number) => {
    const response = await fetchUserHostChannels({
      fid,
    });
    return response;
  },
);

export const userHostChannelsSlice = createSlice({
  name: "userHostChannels",
  initialState: initialUserHostChannelsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getHostChannels.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.done = false;
      })
      .addCase(getHostChannels.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.fid = action.meta.arg;
        state.channels = action.payload.data.data;
        state.done = true;
      })
      .addCase(getHostChannels.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
        state.done = true;
      });
  },
});
export const selectUserHostChannels = (state: RootState) =>
  state.userHostChannels;
export default userHostChannelsSlice.reducer;
