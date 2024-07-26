import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uniqBy from "lodash/uniqBy";
import { fetchRankCurators } from "~/services/rank/api";
import { CuratorEntity, OrderParams, RankOrderBy } from "~/services/rank/types";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

export const DEFAULT_ORDER_PARAMS: OrderParams = {
  order: "DESC",
  orderBy: RankOrderBy.NFT_HOLDING,
};

type CuratorRankState = {
  channel: string | undefined;
  items: CuratorEntity[];
  orderBy: RankOrderBy;
  order: "ASC" | "DESC";
  nextPageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const curatorRankState: CuratorRankState = {
  channel: undefined,
  items: [],
  orderBy: DEFAULT_ORDER_PARAMS.orderBy,
  order: DEFAULT_ORDER_PARAMS.order,
  nextPageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

const PAGE_SIZE = 30;
export const fetchItems = createAsyncThunk(
  "curatorRank/fetchItems",
  async (
    {
      orderParam,
      channel,
    }: { orderParam: OrderParams; channel: string | undefined },
    thunkAPI,
  ) => {
    const { curatorRank } = thunkAPI.getState() as {
      curatorRank: CuratorRankState;
    };
    const response = await fetchRankCurators(
      {
        orderBy: orderParam.orderBy || DEFAULT_ORDER_PARAMS.orderBy,
        order: orderParam.order || DEFAULT_ORDER_PARAMS.order,
        pageSize: PAGE_SIZE,
        pageNumber: curatorRank.nextPageNumber || 1,
      },
      channel,
    );
    return response.data;
  },
);

export const curatorRankSlice = createSlice({
  name: "curatorRank",
  initialState: curatorRankState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        if (
          state.order !== action.meta.arg.orderParam.order ||
          state.orderBy !== action.meta.arg.orderParam.orderBy ||
          state.channel !== action.meta.arg.channel
        ) {
          state.items = [];
          state.channel = action.meta.arg.channel;
          state.order = action.meta.arg.orderParam.order;
          state.orderBy = action.meta.arg.orderParam.orderBy as RankOrderBy;
          state.nextPageNumber = 1;
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const newItems = action.payload.data;
        state.items = uniqBy(state.items.concat(newItems), "userInfo.fid");
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
export const selectCuratorRank = (state: RootState) => state.curatorRank;
export default curatorRankSlice.reducer;
