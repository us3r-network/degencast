import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uniqBy from "lodash/uniqBy";
import { fetchRankChannels } from "~/services/rank/api";
import { RankOrderBy, OrderParams } from "~/services/rank/types";
import { Channel } from "~/services/farcaster/types";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

export const DEFAULT_ORDER_PARAMS: OrderParams = {
  order: "DESC",
  orderBy: RankOrderBy.LAUNCH_PROGRESS,
};

type ChannelRankState = {
  items: Channel[];
  orderBy: RankOrderBy;
  order: "ASC" | "DESC";
  nextPageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const channelRankState: ChannelRankState = {
  items: [],
  orderBy: DEFAULT_ORDER_PARAMS.orderBy,
  order: DEFAULT_ORDER_PARAMS.order,
  nextPageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

const PAGE_SIZE = 30;
export const fetchItems = createAsyncThunk(
  "channelRank/fetchItems",
  async ({ order, orderBy }: OrderParams, thunkAPI) => {
    const { channelRank } = thunkAPI.getState() as {
      channelRank: ChannelRankState;
    };
    const response = await fetchRankChannels({
      orderBy: orderBy || DEFAULT_ORDER_PARAMS.orderBy,
      order: order || DEFAULT_ORDER_PARAMS.order,
      pageSize: PAGE_SIZE,
      pageNumber: channelRank.nextPageNumber || 1,
    });
    return response.data;
  },
);

export const channelRankSlice = createSlice({
  name: "channelRank",
  initialState: channelRankState,
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
        console.log(action.payload.data);
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
export const selectChannelRank = (state: RootState) => state.channelRank;
export default channelRankSlice.reducer;
