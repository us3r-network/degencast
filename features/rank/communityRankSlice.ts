import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uniqBy from "lodash/uniqBy";
import { fetchRankCommunities } from "~/services/community/api/rank";
import { CommunityRankOrderBy } from "~/services/community/types/rank";
import { Channel } from "~/services/farcaster/types";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

export type OrderParams = {
  order: "ASC" | "DESC";
  orderBy: CommunityRankOrderBy;
};

export const DEFAULT_ORDER_PARAMS: OrderParams = {
  order: "DESC",
  orderBy: CommunityRankOrderBy.MARKET_CAP,
};

type CommunityRankState = {
  items: Channel[];
  orderBy: CommunityRankOrderBy;
  order: "ASC" | "DESC";
  nextPageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const communityRankState: CommunityRankState = {
  items: [],
  orderBy: CommunityRankOrderBy.MARKET_CAP,
  order: "DESC",
  nextPageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

const PAGE_SIZE = 30;
export const fetchItems = createAsyncThunk(
  "communityRank/fetchItems",
  async (
    {
      order,
      orderBy,
    }: OrderParams,
    thunkAPI,
  ) => {
    const { communityRank } = thunkAPI.getState() as {
      communityRank: CommunityRankState;
    };
    const response = await fetchRankCommunities({
      orderBy: orderBy || CommunityRankOrderBy.MARKET_CAP,
      order: order || "DESC",
      pageSize: PAGE_SIZE,
      pageNumber: communityRank.nextPageNumber || 1,
    });
    return response.data;
  },
);

export const communityRankSlice = createSlice({
  name: "communityRank",
  initialState: communityRankState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        if (
          state.order !== action.meta.arg.order ||
          state.orderBy !== action.meta.arg.orderBy
        ) {
          state.items = [];
          state.order = action.meta.arg.order;
          state.orderBy = action.meta.arg.orderBy;
          state.nextPageNumber = 1;
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const newItems = action.payload.data;
        state.items = uniqBy(state.items.concat(newItems), "id");
        if (newItems.length >= PAGE_SIZE) {
          state.nextPageNumber += 1;
        } else {
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
