import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { fetchUserChannels } from "~/services/farcaster/api";
import { fetchUserActiveChannels } from "~/services/farcaster/neynar/farcaster";
import { Channel } from "~/services/farcaster/types";
import { PageInfo } from "~/services/farcaster/types/neynar";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

const MAX_PAGE_SIZE = 100;
type UserChannelsState = {
  // cache: Map<number, NeynarChannelsResp>;
  fid?: number;
  items: Channel[];
  next: PageInfo;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserChannelsState: UserChannelsState = {
  fid: undefined,
  items: [],
  next: {
    cursor: null,
  },
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userChannels/fetchItems",
  async (fid: number, thunkAPI) => {
    const { userChannels } = thunkAPI.getState() as {
      userChannels: UserChannelsState;
    };

    let priorityChannels: Channel[] = [];
    if (userChannels.fid !== fid) {
      const firstRes = await fetchUserChannels({
        fid,
      });
      priorityChannels = firstRes.data.data;
    }
    const response = await fetchUserActiveChannels({
      fid,
      limit: MAX_PAGE_SIZE,
      cursor: userChannels.next.cursor,
    });
    response.channels = [...priorityChannels, ...response.channels];
    return response;
  },
);

export const userChannelsSlice = createSlice({
  name: "userChannels",
  initialState: initialUserChannelsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        if (state.fid !== action.meta.arg) {
          state.fid = action.meta.arg;
          state.items = [];
        }
        const channels = uniqBy(
          [...state.items, ...action.payload.channels],
          "id",
        );
        state.items = channels;
        state.next.cursor = action.payload.next.cursor;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserChannels = (state: RootState) => state.userChannels;
export default userChannelsSlice.reducer;
