import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { CommunityInfo } from "~/services/community/types/community";

type CommunityDetailState = {
  basicData: {
    [key: string]: CommunityInfo;
  };
  detailData: {
    [key: string]: CommunityInfo;
  };
  detailPendingIds: string[];
};

const communityDetailState: CommunityDetailState = {
  basicData: {},
  detailData: {},
  detailPendingIds: [],
};

export const communityDetailSlice = createSlice({
  name: "communityDetail",
  initialState: communityDetailState,
  reducers: {
    upsertManyToCommunityBasicData: (
      state: CommunityDetailState,
      action: PayloadAction<
        Array<{
          id: string;
          data: CommunityInfo;
        }>
      >,
    ) => {
      action.payload.forEach((item) => {
        state.basicData[item.id] = item.data;
      });
    },
    upsertCommunityBasicData: (
      state: CommunityDetailState,
      action: PayloadAction<{
        id: string;
        data: CommunityInfo;
      }>,
    ) => {
      state.basicData[action.payload.id] = action.payload.data;
    },
    upsertCommunityDetailData: (
      state: CommunityDetailState,
      action: PayloadAction<{
        id: string;
        data: CommunityInfo;
      }>,
    ) => {
      state.detailData[action.payload.id] = action.payload.data;
    },
    addCommunityDetailPendingId: (
      state: CommunityDetailState,
      action: PayloadAction<string>,
    ) => {
      state.detailPendingIds.push(action.payload);
    },
    removeCommunityDetailPendingId: (
      state: CommunityDetailState,
      action: PayloadAction<string>,
    ) => {
      state.detailPendingIds = state.detailPendingIds.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

const { actions, reducer } = communityDetailSlice;
export const {
  upsertManyToCommunityBasicData,
  upsertCommunityBasicData,
  upsertCommunityDetailData,
  addCommunityDetailPendingId,
  removeCommunityDetailPendingId,
} = actions;
export const selectCommunityDetail = (state: RootState) =>
  state.communityDetail;
export default reducer;
