import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { CommunityInfo } from "~/services/community/types/community";

type communityDetailState = {
  basicData: {
    [key: string]: CommunityInfo;
  };
  detailData: {
    [key: string]: CommunityInfo;
  };
  detailPendingIds: string[];
};

const communityDetailState: communityDetailState = {
  basicData: {},
  detailData: {},
  detailPendingIds: [],
};

export const communityDetailSlice = createSlice({
  name: "communityDetail",
  initialState: communityDetailState,
  reducers: {
    upsertCommunityBasicData: (
      state: communityDetailState,
      action: PayloadAction<{
        id: string;
        data: CommunityInfo;
      }>,
    ) => {
      state.basicData[action.payload.id] = action.payload.data;
    },
    upsertCommunityDetailData: (
      state: communityDetailState,
      action: PayloadAction<{
        id: string;
        data: CommunityInfo;
      }>,
    ) => {
      state.detailData[action.payload.id] = action.payload.data;
    },
    addCommunityDetailPendingId: (
      state: communityDetailState,
      action: PayloadAction<string>,
    ) => {
      state.detailPendingIds.push(action.payload);
    },
    removeCommunityDetailPendingId: (
      state: communityDetailState,
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
  upsertCommunityBasicData,
  upsertCommunityDetailData,
  addCommunityDetailPendingId,
  removeCommunityDetailPendingId,
} = actions;
export const selectCommunityDetail = (state: RootState) =>
  state.communityDetail;
export default reducer;
