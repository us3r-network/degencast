import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { PageInfo } from "~/services/farcaster/types/neynar";
import { CastData, getUserCasts } from "~/services/feeds/api/user";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

const MAX_PAGE_SIZE = 20;
type UserCastsState = {
  // cache: Map<number, NeynarChannelsResp>;
  fid?: number;
  items: CastData[];
  next: PageInfo;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserCastsState: UserCastsState = {
  fid: undefined,
  items: [],
  next: {
    cursor: null,
  },
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCasts/fetchItems",
  async (
    { fid, viewer_fid }: { fid: number; viewer_fid?: number },
    thunkAPI,
  ) => {
    const { userCasts } = thunkAPI.getState() as {
      userCasts: UserCastsState;
    };
    const response = await getUserCasts({
      fid,
      viewer_fid,
      limit: MAX_PAGE_SIZE,
      cursor: userCasts.next.cursor || undefined,
    });
    return response;
  },
);

export const userCastsSlice = createSlice({
  name: "userCasts",
  initialState: initialUserCastsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        if (state.fid !== action.meta.arg.fid) {
          state.fid = action.meta.arg.fid;
          state.items = [];
          state.next.cursor = null;
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        const responseData = action.payload.data.data;
        const casts = uniqBy([...state.items, ...responseData.casts], "cast.hash");
        state.items = casts;
        state.next.cursor = responseData.next.cursor;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserCasts = (state: RootState) => state.userCasts;
export default userCastsSlice.reducer;
