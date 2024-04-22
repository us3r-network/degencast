import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import { communityTokens } from "~/services/trade/api";
import { TokenInfoWithStats } from "~/services/trade/types";
import type { RootState } from "../../store/store";

type CommunityTokenState = {
  items: TokenInfoWithStats[];
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
        state.items = action.payload.data;
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
