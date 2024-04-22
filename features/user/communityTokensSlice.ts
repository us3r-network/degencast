import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import { TokenInfoWithMetadata } from "~/services/user/types";
import type { RootState } from "../../store/store";
import { myTokens } from "~/services/user/api";

type UserCommunityTokenState = {
  items: TokenInfoWithMetadata[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const userCommunityTokenState: UserCommunityTokenState = {
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCommunityTokens/fetchItems",
  async (address:`0x${string}`) => {
    const response = await myTokens(address);
    return response.data;
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
        state.items = action.payload.data.filter(
          (item) =>
            item.name &&
            item.balance &&
            Number(item.balance) > 0 &&
            item.tradeInfo?.channel,
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
