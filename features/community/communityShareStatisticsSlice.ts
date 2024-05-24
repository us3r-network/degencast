import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import {
  CommunitySharesData,
  fetchCommunityShareInfos,
  fetchCommunityShares,
} from "~/services/community/api/share";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { cloneDeep } from "lodash";

type CommunityShareStatistics = {
  holders: number;
  supply: number;
};
type CommunityShareStatisticsState = {
  [channelId: string]: {
    statistics: CommunityShareStatistics;
    status: AsyncRequestStatus;
    errorMsg: string;
  };
};

export const groupDataDefault = {
  statistics: {
    holders: 0,
    supply: 0,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};
const communityShareStatisticsState: CommunityShareStatisticsState = {};

export const fetchStatistics = createAsyncThunk<
  CommunityShareStatistics,
  {
    channelId: string;
  }
>(
  "communityShareStatistics/fetchStatistics",
  async ({ channelId }, { rejectWithValue }) => {
    const resp = await fetchCommunityShareInfos({
      channelId,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: ({ channelId }, { getState }) => {
      const state = getState() as RootState;
      const { communityShareStatistics } = state;
      const data = communityShareStatistics[channelId];
      if (!data) {
        return true;
      }
      const { status } = data;
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  },
);

export const communityShareStatisticsSlice = createSlice({
  name: "communityShareStatistics",
  initialState: communityShareStatisticsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStatistics.pending, (state, action) => {
        const { channelId } = action.meta.arg;
        if (!state[channelId]) {
          state[channelId] = cloneDeep(groupDataDefault);
        }
        state[channelId].errorMsg = "";
        state[channelId].status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].statistics = action.payload;
        state[channelId].status = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        const { channelId } = action.meta.arg;
        state[channelId].errorMsg = action.error.message || "";
        state[channelId].status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = communityShareStatisticsSlice;
export const selectCommunityShareStatistics = (state: RootState) =>
  state.communityShareStatistics;
export default reducer;
