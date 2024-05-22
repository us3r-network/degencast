import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { fetchUserActiveChannels } from "~/services/farcaster/neynar/farcaster";
import { Channel, NeynarChannelsResp } from "~/services/farcaster/types/neynar";
import {
  AsyncRequestStatus
} from "~/services/shared/types";
import type { RootState } from "../../store/store";

const MAX_PAGE_SIZE = 100;
type UserChannelsState = {
  cache: Map<number, NeynarChannelsResp>;
  fid?: number;
  items: Channel[];
  next: {
    cursor: string | null;
  };
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserChannelsState: UserChannelsState = {
  cache: new Map(),
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
    if (userChannels.fid !== fid) {
      userChannels.fid = fid;
      userChannels.items = initialUserChannelsState.items;
      userChannels.next = initialUserChannelsState.next;
      userChannels.error = initialUserChannelsState.error;
      userChannels.status = initialUserChannelsState.status;
      const existCache = userChannels.cache.get(fid);
      if (existCache && userChannels.items.length === 0) return existCache;
    }
    if (userChannels.items.length > 0 && !userChannels.next.cursor) {
      return {
        channels: [],
        next: {
          cursor: null,
        },
      };
    } else {
      const response = await fetchUserActiveChannels({
        fid,
        limit: MAX_PAGE_SIZE,
        cursor: userChannels.next.cursor,
      });
      return response;
    }
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
        // state.items = [];
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        if (action.meta.requestStatus === AsyncRequestStatus.FULFILLED) {
          state.cache.set(action.meta.arg, action.payload);
        }
        // state.items = action.payload.channels;
        state.fid = action.meta.arg;
        const channels = uniqBy([...state.items, ...action.payload.channels],"id");
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
