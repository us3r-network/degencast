import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { CastData, getUserCurationCasts } from "~/services/feeds/api/user";
import { AsyncRequestStatus } from "~/services/shared/types";
import type { RootState } from "../../store/store";

const MAX_PAGE_SIZE = 20;
type UserCurationCastsState = {
  // cache: Map<number, NeynarChannelsResp>;
  fid?: number;
  items: CastData[];
  pageNumber: number;
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserCurationCastsState: UserCurationCastsState = {
  fid: undefined,
  items: [],
  pageNumber: 1,
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCurationCasts/fetchItems",
  async (
    { fid, viewer_fid }: { fid: number; viewer_fid?: number },
    thunkAPI,
  ) => {
    const { userCurationCasts } = thunkAPI.getState() as {
      userCurationCasts: UserCurationCastsState;
    };
    if (userCurationCasts.fid !== fid) userCurationCasts.pageNumber = 1;
    console.log("user curation casts fetchItems", userCurationCasts);
    if (userCurationCasts.pageNumber) {
      const response = await getUserCurationCasts({
        fid,
        viewer_fid,
        pageSize: MAX_PAGE_SIZE,
        pageNumber: userCurationCasts.pageNumber,
      });
      return response;
    } else {
      return null;
    }
  },
);

export const userCurationCastsSlice = createSlice({
  name: "userCurationCasts",
  initialState: initialUserCurationCastsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        if (state.fid !== action.meta.arg.fid) {
          state.fid = action.meta.arg.fid;
          state.items = [];
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        if (action.payload) {
          const responseData = action.payload.data.data;
          console.log("user curation casts fetchItems fulfilled", responseData);
          const casts = uniqBy(
            [...state.items, ...(responseData || [])],
            "cast.hash",
          );
          state.items = casts;
          if (responseData?.length === MAX_PAGE_SIZE)
            state.pageNumber = state.pageNumber + 1;
          else state.pageNumber = 0;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserCurationCasts = (state: RootState) =>
  state.userCurationCasts;
export default userCurationCastsSlice.reducer;
