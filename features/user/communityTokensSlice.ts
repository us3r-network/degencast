import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ApiResp,
  ApiRespCode,
  AsyncRequestStatus,
} from "~/services/shared/types";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { myTokens } from "~/services/user/api";
import type { RootState } from "../../store/store";

type UserCommunityTokenState = {
  cache: Map<`0x${string}`, ApiResp<TokenWithTradeInfo[]>>;
  address?: `0x${string}`;
  items: TokenWithTradeInfo[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserCommunityTokenState: UserCommunityTokenState = {
  cache: new Map(),
  address: undefined,
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
    if (userCommunityTokens.address !== address) {
      const existCache = userCommunityTokens.cache.get(address);
      if (existCache?.data) return existCache;
    }
    const response = await myTokens(address);
    return response.data;
  },
);

export const userCommunityTokenSlice = createSlice({
  name: "userCommunityTokens",
  initialState: initialUserCommunityTokenState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        const address = action.meta.arg;
        if (state.address !== address) {
          state.address = address;
          state.items = initialUserCommunityTokenState.items;
          state.error = initialUserCommunityTokenState.error;
          state.status = initialUserCommunityTokenState.status;
        }
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
            Number(item.balance) > 0
        );
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
