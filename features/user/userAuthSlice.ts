import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { Author } from "~/services/farcaster/types/neynar";
import { fetchUserBulk } from "~/services/farcaster/neynar/farcaster";
import { LoginRespEntity } from "~/services/user/types";
import { getMyDegencast } from "~/services/user/api";

type UserAuthState = {
  degencastId: string | number;
  degencastLoginRequestStatus: AsyncRequestStatus;
  currNeynarUserInfo: Author | undefined;
  currNeynarUserInfoRequestStatus: AsyncRequestStatus;
  degencastUserInfo: LoginRespEntity | undefined;
  degencastUserInfoRequestStatus: AsyncRequestStatus;
};

const userAuthState: UserAuthState = {
  degencastId: "",
  degencastLoginRequestStatus: AsyncRequestStatus.IDLE,
  currNeynarUserInfo: undefined,
  currNeynarUserInfoRequestStatus: AsyncRequestStatus.IDLE,
  degencastUserInfo: undefined,
  degencastUserInfoRequestStatus: AsyncRequestStatus.IDLE,
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

export const fetchDegencastUserInfo = createAsyncThunk(
  "userAuth/fetchDegencastUserInfo",
  async () => {
    const resp = await getMyDegencast();
    const { code, msg, data } = resp.data;
    if (code === ApiRespCode.SUCCESS) {
      return data;
    }
    throw new Error(msg);
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { userAuth } = state;
      const { degencastUserInfo } = userAuth;
      if (degencastUserInfo) {
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
    clearDegencastUserInfo: (state: UserAuthState) => {
      state.degencastUserInfo = undefined;
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
      })
      .addCase(fetchDegencastUserInfo.pending, (state) => {
        state.degencastUserInfoRequestStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchDegencastUserInfo.fulfilled, (state, action) => {
        state.degencastUserInfo = action.payload;
        state.degencastUserInfoRequestStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchDegencastUserInfo.rejected, (state) => {
        state.degencastUserInfoRequestStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = userAuthSlice;
export const {
  setDegencastId,
  clearDegencastId,
  setDegencastLoginRequestStatus,
  clearDegencastUserInfo,
} = actions;
export const selectUserAuth = (state: RootState) => state.userAuth;
export default reducer;
