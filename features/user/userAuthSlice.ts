import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { AsyncRequestStatus } from "~/services/shared/types";
import { Author } from "~/services/farcaster/types/neynar";
import { fetchUserBulk } from "~/services/farcaster/neynar/farcaster";

type UserAuthState = {
  degencastId: string | number;
  degencastLoginRequestStatus: AsyncRequestStatus;
  currNeynarUserInfo: Author | undefined;
  currNeynarUserInfoRequestStatus: AsyncRequestStatus;
};

const userAuthState: UserAuthState = {
  degencastId: "",
  degencastLoginRequestStatus: AsyncRequestStatus.IDLE,
  currNeynarUserInfo: undefined,
  currNeynarUserInfoRequestStatus: AsyncRequestStatus.IDLE,
};

export const fetchCurrUserInfo = createAsyncThunk(
  "userAuth/fetchCurrUserInfo",
  async ({ fid }: { fid: number }) => {
    const res = await fetchUserBulk({
      fids: [Number(fid)],
    });
    const { users } = res;
    if (users.length > 0) {
      return users[0];
    }
    throw new Error("No user found");
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { userAuth } = state;
      const { currNeynarUserInfoRequestStatus } = userAuth;
      if (currNeynarUserInfoRequestStatus === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  },
);

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: userAuthState,
  reducers: {
    setDegencastId: (
      state: UserAuthState,
      action: PayloadAction<string | number>,
    ) => {
      state.degencastId = action.payload;
    },
    clearDegencastId: (state: UserAuthState) => {
      state.degencastId = "";
    },
    setDegencastLoginRequestStatus: (
      state: UserAuthState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.degencastLoginRequestStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrUserInfo.pending, (state) => {
        state.currNeynarUserInfoRequestStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchCurrUserInfo.fulfilled, (state, action) => {
        state.currNeynarUserInfo = action.payload;
        state.currNeynarUserInfoRequestStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchCurrUserInfo.rejected, (state) => {
        state.currNeynarUserInfoRequestStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = userAuthSlice;
export const {
  setDegencastId,
  clearDegencastId,
  setDegencastLoginRequestStatus,
} = actions;
export const selectUserAuth = (state: RootState) => state.userAuth;
export default reducer;
