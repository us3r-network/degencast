import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { fetchUserRecommendChannels } from "~/services/farcaster/api";
import {
  fetchUserActiveChannels,
  fetchUserFollowingChannels,
} from "~/services/farcaster/neynar/farcaster";
import { Channel } from "~/services/farcaster/types";
import {
  NeynarChannelsResp,
  PageInfo,
} from "~/services/farcaster/types/neynar";
import { ApiResp, AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

const MAX_PAGE_SIZE = 100;
export enum UserChannelsType {
  HOLDING = "holding",
  FOLLOWING = "following",
  ACTIVE = "active",
}
type UserChannelsState = {
  fid?: number;
  channels: Map<UserChannelsType, ChannelsState>;
  status: AsyncRequestStatus;
  error: string | undefined;
};

type ChannelsState = {
  items: Channel[];
  next: PageInfo;
};

const initialChannelsState: ChannelsState = {
  items: [],
  next: {
    cursor: null,
  },
};

const initialUserChannelsState: UserChannelsState = {
  fid: undefined,
  channels: new Map([
    [UserChannelsType.HOLDING, { ...initialChannelsState }],
    [UserChannelsType.FOLLOWING, { ...initialChannelsState }],
    [UserChannelsType.ACTIVE, { ...initialChannelsState }],
  ]),
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userChannels/fetchItems",
  async ({ fid, type }: { fid: number; type: UserChannelsType }, thunkAPI) => {
    const { userChannels } = thunkAPI.getState() as {
      userChannels: UserChannelsState;
    };
    const channelState = userChannels.channels.get(type);
    const cursor = channelState?.next.cursor;
    switch (type) {
      case UserChannelsType.HOLDING:
        return fetchUserRecommendChannels({
          fid,
        });
      case UserChannelsType.FOLLOWING:
        return fetchUserFollowingChannels({
          fid,
          limit: MAX_PAGE_SIZE,
          cursor,
        });
      case UserChannelsType.ACTIVE:
        return fetchUserActiveChannels({
          fid,
          limit: MAX_PAGE_SIZE,
          cursor,
        });
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
        if (state.fid !== action.meta.arg.fid) {
          state.fid = action.meta.arg.fid;
          const type = action.meta.arg.type;
          const channelState = state.channels.get(type);
          state.channels.set(type, { ...initialChannelsState });
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const type = action.meta.arg.type;
        const channelState = state.channels.get(type);
        console.log("fetchItems.fulfilled", action.payload);

        switch (action.meta.arg.type) {
          case UserChannelsType.HOLDING:
            const allChannles = (action.payload as any).data.data;
            state.channels.set(type, {
              items: allChannles,
              next: (action.payload as NeynarChannelsResp).next || {
                cursor: null,
              },
            });
            break;
          case UserChannelsType.FOLLOWING:
          case UserChannelsType.ACTIVE:
            const newChannles = (action.payload as NeynarChannelsResp).channels;
            const mergeItems = uniqBy(
              [...(channelState?.items || []), ...newChannles],
              "id",
            );
            state.channels.set(type, {
              items: mergeItems,
              next: (action.payload as NeynarChannelsResp).next || {
                cursor: null,
              },
            });
            break;
          default:
            break;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserChannels = (state: RootState) => state.userChannels;
export default userChannelsSlice.reducer;
