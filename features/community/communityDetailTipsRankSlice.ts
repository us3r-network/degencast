import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import {
  CommunityTipsRankData,
  fetchCommunityTipsRank,
} from "~/services/community/api/tips";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { cloneDeep } from "lodash";

type CommunityDetailTipsRankState = {
  [channelId: string]: {
    items: CommunityTipsRankData;
    pageInfo: {
      hasNextPage: boolean;
      nextPageNumber: number;
    };
    status: AsyncRequestStatus;
    errorMsg: string;
  };
};

export const groupDataDefault = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};
const communityDetailTipsRankState: CommunityDetailTipsRankState = {};
const PAGE_SIZE = 20;

export const fetchItems = createAsyncThunk<
  CommunityTipsRankData,
  {
    channelId: string;
  }
>(
  "communityDetailTipsRank/fetchItems",
  async ({ channelId }, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { communityDetailTipsRank } = state;
    const data = communityDetailTipsRank[channelId];
    const nextPageNumber = data?.pageInfo?.nextPageNumber || 1;
    const resp = await fetchCommunityTipsRank({
      pageSize: PAGE_SIZE,
      pageNumber: nextPageNumber,
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
      const { communityDetailTipsRank } = state;
      const data = communityDetailTipsRank[channelId];
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

export const communityDetailTipsRankSlice = createSlice({
  name: "communityDetailTipsRank",
  initialState: communityDetailTipsRankState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        const { channelId } = action.meta.arg;
        if (!state[channelId]) {
          state[channelId] = cloneDeep(groupDataDefault);
        }
        state[channelId].errorMsg = "";
        state[channelId].status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].status = AsyncRequestStatus.FULFILLED;
        const newItems = action?.payload || [];
        state[channelId].items.push(...newItems);
        if (newItems.length >= PAGE_SIZE) {
          state[channelId].pageInfo.nextPageNumber += 1;
        } else {
          state[channelId].pageInfo.hasNextPage = false;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].errorMsg = action.error.message || "";
        state[channelId].status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = communityDetailTipsRankSlice;
export const selectCommunityDetailTipsRank = (state: RootState) =>
  state.communityDetailTipsRank;
export default reducer;
