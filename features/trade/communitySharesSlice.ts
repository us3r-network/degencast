import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import { ShareInfo } from "~/services/trade/types";
import type { RootState } from "../../store/store";
import { communityShares } from "~/services/trade/api";

type CommunityShareState = {
  items: ShareInfo[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const communityShareState: CommunityShareState = {
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "communityShares/fetchItems",
  async () => {
    const response = await communityShares();
    return response.data;
  },
);

export const communityShareSlice = createSlice({
  name: "communityShares",
  initialState: communityShareState,
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
export const selectCommunityShares = (state: RootState) =>
  state.communityShares;
export default communityShareSlice.reducer;
