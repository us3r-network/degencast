import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  fetchTrendingCommunities,
  TrendingCommunitiesData,
} from "~/services/community/api/community";
import { upsertManyToCommunityBasicData } from "./communityDetailSlice";

type CommunityTrendingState = {
  items: TrendingCommunitiesData;
  pageInfo: {
    hasNextPage: boolean;
    nextPageNumber: number;
  };
  status: AsyncRequestStatus;
  errorMsg: string;
};

const communityTrendingState: CommunityTrendingState = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};

const PAGE_SIZE = 20;
export const fetchItems = createAsyncThunk<TrendingCommunitiesData>(
  "communityTrending/fetchItems",
  async (arg, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { communityTrending } = state;
    const nextPageNumber = communityTrending?.pageInfo?.nextPageNumber || 1;
    const resp = await fetchTrendingCommunities({
      pageSize: PAGE_SIZE,
      pageNumber: nextPageNumber,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      const data = resp.data.data || [];
      const communityBasicData = data
        .filter((item) => !!item.channelId)
        .map((item) => ({
          id: item.channelId as string,
          data: item,
        }));
      dispatch(upsertManyToCommunityBasicData(communityBasicData));
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { communityTrending } = state;
      const { status, pageInfo } = communityTrending;
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

export const communityTrendingSlice = createSlice({
  name: "communityTrending",
  initialState: communityTrendingState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = "";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.items = state.items.concat(action.payload);
        state.pageInfo.nextPageNumber += 1;
        state.pageInfo.hasNextPage = action.payload.length >= PAGE_SIZE;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || "Unknown error";
      });
  },
});

const { actions, reducer } = communityTrendingSlice;
export const selectCommunityTrending = (state: RootState) =>
  state.communityTrending;
export default reducer;
