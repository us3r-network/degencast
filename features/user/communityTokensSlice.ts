import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ApiResp,
  ApiRespCode,
  AsyncRequestStatus,
} from "~/services/shared/types";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { myTokens } from "~/services/user/api";
import type { RootState } from "../../store/store";
import { Item } from "~/components/primitives/radio-group";

type UserCommunityTokenState = {
  cache: Map<`0x${string}`, ApiResp<TokenWithTradeInfo[]>>;
  items: TokenWithTradeInfo[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const userCommunityTokenState: UserCommunityTokenState = {
  cache: new Map(),
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCommunityTokens/fetchItems",
  async (address: `0x${string}`, thunkAPI) => {
    const { userCommunityTokens } = thunkAPI.getState() as {
      userCommunityTokens: UserCommunityTokenState;
    };
    const existCache = userCommunityTokens.cache.get(address);
    if (existCache?.data) {
      return existCache;
    } else {
      const response = await myTokens(address);
      return response.data;
    }
  },
);

export const userCommunityTokenSlice = createSlice({
  name: "userCommunityTokens",
  initialState: userCommunityTokenState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.items = [];
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        if (action.payload.code == ApiRespCode.SUCCESS) {
          state.cache.set(action.meta.arg, action.payload);
        }
        state.items = action.payload.data.filter(
          (item) =>
            item.name &&
            item.balance &&
            Number(item.balance) > 0 &&
            item.tradeInfo?.channel,
        ).map((item) => { //todo: rewrite here after api is ready
          return {
            ...item,
            address: item.contractAddress,
            logoURI: item.logo,
          } as TokenWithTradeInfo;
        });
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserCommunityTokens = (state: RootState) =>
  state.userCommunityTokens;
export default userCommunityTokenSlice.reducer;
