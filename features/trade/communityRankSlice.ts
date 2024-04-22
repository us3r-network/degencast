import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import {
  fetchTrendingCommunities,
} from "~/services/community/api/community";
import type { RootState } from "../../store/store";
import { CommunityInfo } from "~/services/community/types/community";
import uniqBy from "lodash/uniqBy";

type CommunityShareState = {
  items: CommunityInfo[];
  nextPageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const communityShareState: CommunityShareState = {
  items: [],
  nextPageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

const PAGE_SIZE = 30;
export const fetchItems = createAsyncThunk(
  "communityRank/fetchItems",
  async () => {
    const response = await fetchTrendingCommunities({
      pageSize: PAGE_SIZE,
      pageNumber: communityShareState.nextPageNumber,
      type: undefined,
    });
    return response.data;
  },
);

export const communityRankSlice = createSlice({
  name: "communityRank",
  initialState: communityShareState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const newItems = action.payload.data;
        state.items = uniqBy(state.items.concat(newItems), "channelId");
        if (newItems.length > PAGE_SIZE) {
          state.nextPageNumber += 1;
        }else{
          state.nextPageNumber = 0;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectCommunityRank = (state: RootState) => state.communityRank;
export default communityRankSlice.reducer;
