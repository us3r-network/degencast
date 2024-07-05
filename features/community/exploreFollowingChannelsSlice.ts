import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  ExploreFollowingChannelsData,
  getExploreFollowingChannels,
} from "~/services/community/api/community";
import { upsertManyToReactions } from "../cast/castReactionsSlice";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

type ExploreFollowingChannelsState = {
  items: ExploreFollowingChannelsData;
  pageInfo: {
    hasNextPage: boolean;
    nextPageNumber: number;
  };
  status: AsyncRequestStatus;
  errorMsg: string;
};

const exploreFollowingChannelsState: ExploreFollowingChannelsState = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};

const PAGE_SIZE = 10;
export const fetchItems = createAsyncThunk<ExploreFollowingChannelsData>(
  "exploreFollowingChannels/fetchItems",
  async (arg, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { exploreFollowingChannels } = state;
    const nextPageNumber =
      exploreFollowingChannels?.pageInfo?.nextPageNumber || 1;
    const resp = await getExploreFollowingChannels({
      pageSize: PAGE_SIZE,
      pageNumber: nextPageNumber,
    });
    const { code, data } = resp.data;
    if (code === ApiRespCode.SUCCESS) {
      const channels = data.map((item) => ({
        ...item,
        cast: item.cast && Object.keys(item.cast).length > 0 ? item.cast : null,
      }));
      const casts = channels
        .filter((item) => !!item.cast)
        .map((item) => item.cast);
      const reactions = getReactionsCountAndViewerContexts(casts as any[]);
      dispatch(upsertManyToReactions(reactions));
      return channels;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { exploreFollowingChannels } = state;
      const { status, pageInfo } = exploreFollowingChannels;
      if (
        status === AsyncRequestStatus.PENDING ||
        status === AsyncRequestStatus.REJECTED
      ) {
        return false;
      }
      if (!pageInfo.hasNextPage) {
        return false;
      }
      return true;
    },
  },
);

export const exploreFollowingChannelsSlice = createSlice({
  name: "exploreFollowingChannels",
  initialState: exploreFollowingChannelsState,
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

const { actions, reducer } = exploreFollowingChannelsSlice;
export const selectExploreFollowingChannels = (state: RootState) =>
  state.exploreFollowingChannels;
export default reducer;
