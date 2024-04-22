import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncRequestStatus } from "~/services/shared/types";
import { ShareInfo } from "~/services/user/types";
import type { RootState } from "../../store/store";
import { myShares } from "~/services/user/api";

type UserCommunityShareState = {
  items: ShareInfo[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const userCommunityShareState: UserCommunityShareState = {
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCommunityShares/fetchItems",
  async (address:`0x${string}`) => {
    const response = await myShares(address);
    return response.data;
  },
);

export const userCommunityShareSlice = createSlice({
  name: "communityShares",
  initialState: userCommunityShareState,
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
export const selectUserCommunityShares = (state: RootState) =>
  state.userCommunityShares;
export default userCommunityShareSlice.reducer;
