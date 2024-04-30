import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  ChannelCastData,
  ChannelTrendingCastData,
  getFarcasterTrendingWithChannelId,
} from "~/services/farcaster/api";
import { UserData, userDataObjFromArr } from "~/utils/farcaster/user-data";

type CommunityDetailCastsState = {
  [channelId: string]: {
    items: Array<ChannelCastData>;
    pageInfo: {
      hasNextPage: boolean;
      endIndex: number;
    };
    farcasterUserDataObj: Record<string, UserData>;
    status: AsyncRequestStatus;
    errorMsg: string;
  };
};

export const groupDataDefault = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    endIndex: 0,
  },
  farcasterUserDataObj: {},
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};
const communityDetailCastsState: CommunityDetailCastsState = {};

const PAGE_SIZE = 20;
export const fetchItems = createAsyncThunk<
  ChannelTrendingCastData,
  {
    channelId: string;
  }
>(
  "communityDetailCasts/fetchItems",
  async ({ channelId }, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { communityDetailCasts } = state;
    const data = communityDetailCasts[channelId];
    const endIndex = data?.pageInfo?.endIndex || 0;
    const resp = await getFarcasterTrendingWithChannelId({
      start: endIndex === 0 ? 0 : endIndex + 1,
      end: endIndex === 0 ? PAGE_SIZE - 1 : endIndex + PAGE_SIZE,
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
        if (!state[channelId]) {
          state[channelId] = groupDataDefault;
        }
        state[channelId].errorMsg = "";
        state[channelId].status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].status = AsyncRequestStatus.FULFILLED;
        const { casts: newItems, farcasterUserData, pageInfo } = action.payload;
        state[channelId].items.push(...newItems);
        state[channelId].pageInfo = { ...pageInfo };
        if (farcasterUserData.length > 0) {
          const userDataObj = userDataObjFromArr(farcasterUserData);
          state[channelId].farcasterUserDataObj = {
            ...state[channelId].farcasterUserDataObj,
            ...userDataObj,
          };
        }
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
