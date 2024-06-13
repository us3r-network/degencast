import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  CoverChannelsData,
  fetchCoverChannels,
} from "~/services/community/api/community";

type CoverChannelsState = {
  items: CoverChannelsData;
  pageInfo: {
    hasNextPage: boolean;
    nextPageNumber: number;
  };
  status: AsyncRequestStatus;
  errorMsg: string;
};

const coverChannelsState: CoverChannelsState = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
};

const PAGE_SIZE = 9;
export const fetchItems = createAsyncThunk<CoverChannelsData>(
  "coverChannels/fetchItems",
  async (arg, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { coverChannels } = state;
    const nextPageNumber = coverChannels?.pageInfo?.nextPageNumber || 1;
    const resp = await fetchCoverChannels({
      pageSize: PAGE_SIZE,
      pageNumber: nextPageNumber,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (arg, { getState }) => {
      const state = getState() as RootState;
      const { coverChannels } = state;
      const { status, pageInfo } = coverChannels;
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      if (coverChannels.items.length >= PAGE_SIZE) {
        return false;
      }
      if (!pageInfo.hasNextPage) {
        return false;
      }
      return true;
    },
  },
);

export const coverChannelsSlice = createSlice({
  name: "coverChannels",
  initialState: coverChannelsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = "";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.items = state.items.concat(action.payload);
        state.pageInfo.nextPageNumber += 1;
        state.pageInfo.hasNextPage = action.payload.length >= PAGE_SIZE;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || "Unknown error";
      });
  },
});

const { actions, reducer } = coverChannelsSlice;
export const selectCoverChannels = (state: RootState) => state.coverChannels;
export default reducer;
