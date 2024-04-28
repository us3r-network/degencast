import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import { communityTokens } from "~/services/trade/api";
import { TokenWithTradeInfo } from "~/services/trade/types";
import type { RootState } from "../../store/store";

type CommunityTokenState = {
  items: TokenWithTradeInfo[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const communityTokenState: CommunityTokenState = {
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "communityTokens/fetchItems",
  async () => {
    const response = await communityTokens();
    return response.data;
  },
);

export const communityTokenSlice = createSlice({
  name: "communityTokens",
  initialState: communityTokenState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        //todo: rewrite here after api is ready
        state.items = action.payload.data.map((item) => {
          return {
            chainId: item.chain_id,
            address: item.tokenAddress,
            decimals: 18,
            symbol: "",
            name: item.name,
            logoURI: item.imageURL,
            channelId: item.channel,
            tradeInfo: item,
          } as TokenWithTradeInfo;
        });
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectCommunityTokens = (state: RootState) =>
  state.communityTokens;
export default communityTokenSlice.reducer;
