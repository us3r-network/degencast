import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uniqBy from "lodash/uniqBy";
import { fetchRankTokens } from "~/services/rank/api";
import { OrderParams, RankOrderBy } from "~/services/rank/types";
import { Channel } from "~/services/farcaster/types";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

export const DEFAULT_ORDER_PARAMS: OrderParams = {
  order: "DESC",
  orderBy: RankOrderBy.MARKET_CAP,
};

type TokenRankState = {
  items: Channel[];
  orderBy: RankOrderBy;
  order: "ASC" | "DESC";
  nextPageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const tokenRankState: TokenRankState = {
  items: [],
  orderBy: DEFAULT_ORDER_PARAMS.orderBy,
  order: DEFAULT_ORDER_PARAMS.order,
  nextPageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

const PAGE_SIZE = 30;
export const fetchItems = createAsyncThunk(
  "tokenRank/fetchItems",
  async ({ order, orderBy }: OrderParams, thunkAPI) => {
    const { tokenRank } = thunkAPI.getState() as {
      tokenRank: TokenRankState;
    };
    const response = await fetchRankTokens({
      orderBy: orderBy || DEFAULT_ORDER_PARAMS.orderBy,
      order: order || DEFAULT_ORDER_PARAMS.order,
      pageSize: PAGE_SIZE,
      pageNumber: tokenRank.nextPageNumber || 1,
    });
    return response.data;
  },
);

export const tokenRankSlice = createSlice({
  name: "tokenRank",
  initialState: tokenRankState,
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
          state.orderBy = action.meta.arg.orderBy as RankOrderBy;
          state.nextPageNumber = 1;
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const newItems = action.payload.data.filter((item) => !!item.id);
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
export const selectTokenRank = (state: RootState) => state.tokenRank;
export default tokenRankSlice.reducer;
