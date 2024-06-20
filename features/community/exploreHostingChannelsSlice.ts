import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  ExploreHostingChannelsData,
  getExploreHostingChannels,
} from "~/services/community/api/community";
import { viewerContextsFromCasts } from "~/utils/farcaster/viewerContext";
import { upsertManyToReactions } from "../cast/castReactionsSlice";

type ExploreHostingChannelsState = {
  items: ExploreHostingChannelsData;
  pageInfo: {
    hasNextPage: boolean;
    nextPageNumber: number;
  };
  status: AsyncRequestStatus;
  errorMsg: string;
};

const exploreHostingChannelsState: ExploreHostingChannelsState = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};

const PAGE_SIZE = 10;
export const fetchItems = createAsyncThunk<ExploreHostingChannelsData>(
  "exploreHostingChannels/fetchItems",
  async (arg, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { exploreHostingChannels } = state;
    const nextPageNumber =
      exploreHostingChannels?.pageInfo?.nextPageNumber || 1;
    const resp = await getExploreHostingChannels({
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
      const viewerContexts = viewerContextsFromCasts(casts as any[]);
      dispatch(upsertManyToReactions(viewerContexts));
      return channels;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { exploreHostingChannels } = state;
      const { status, pageInfo } = exploreHostingChannels;
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

export const exploreHostingChannelsSlice = createSlice({
  name: "exploreHostingChannels",
  initialState: exploreHostingChannelsState,
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

const { actions, reducer } = exploreHostingChannelsSlice;
export const selectExploreHostingChannels = (state: RootState) =>
  state.exploreHostingChannels;
export default reducer;
