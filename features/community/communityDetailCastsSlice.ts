import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  NaynarChannelCastsFeedData,
  getNaynarChannelCastsFeed,
} from "~/services/farcaster/api";
import { cloneDeep } from "lodash";
import { NeynarCast } from "~/services/farcaster/types/neynar";

type CommunityDetailCastsState = {
  [channelId: string]: {
    items: Array<NeynarCast>;
    pageInfo: {
      hasNextPage: boolean;
      cursor: string;
    };
    status: AsyncRequestStatus;
    errorMsg: string;
  };
};

export const groupDataDefault = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    cursor: "",
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};
const communityDetailCastsState: CommunityDetailCastsState = {};

const PAGE_SIZE = 10;
export const fetchItems = createAsyncThunk<
  NaynarChannelCastsFeedData,
  {
    channelId: string;
  }
>(
  "communityDetailCasts/fetchItems",
  async ({ channelId }, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { communityDetailCasts } = state;
    const data = communityDetailCasts[channelId];
    const cursor = data?.pageInfo?.cursor || "";
    const resp = await getNaynarChannelCastsFeed({
      cursor,
      limit: PAGE_SIZE,
      channelId,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: ({ channelId }, { getState }) => {
      const state = getState() as RootState;
      const { communityDetailCasts } = state;
      const data = communityDetailCasts[channelId];
      if (!data) {
        return true;
      }
      const { status, pageInfo } = data;
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      if (!pageInfo.hasNextPage) {
        return false;
      }
      return true;
    },
  },
);

export const communityDetailCastsSlice = createSlice({
  name: "communityDetailCasts",
  initialState: communityDetailCastsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        const { channelId } = action.meta.arg;
        if (!state?.[channelId]) {
          state[channelId] = cloneDeep(groupDataDefault);
        }
        state[channelId].errorMsg = "";
        state[channelId].status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { channelId } = action.meta.arg;
        if (!state?.[channelId]) {
          state[channelId] = cloneDeep(groupDataDefault);
        }
        state[channelId].status = AsyncRequestStatus.FULFILLED;
        const { casts: newItems, pageInfo } = action.payload;
        state[channelId].items.push(...(newItems || []));
        state[channelId].pageInfo = { ...pageInfo };
      })
      .addCase(fetchItems.rejected, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].errorMsg = action.error.message || "";
        state[channelId].status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = communityDetailCastsSlice;
export const selectCommunityDetailCasts = (state: RootState) =>
  state.communityDetailCasts;
export default reducer;
