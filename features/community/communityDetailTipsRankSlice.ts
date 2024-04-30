import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { CommunityTipsRankData } from "~/services/community/api/tips";

type TipsRankGroupData = {
  items: CommunityTipsRankData;
  pageInfo: {
    hasNextPage: boolean;
    nextPageNumber: number;
  };
  loading: boolean;
};

type CommunityDetailTipsRankState = {
  groupData: {
    [key: string]: TipsRankGroupData;
  };
};

const groupDataDefault = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  loading: false,
};
const communityDetailTipsRankState: CommunityDetailTipsRankState = {
  groupData: {},
};

export const communityDetailTipsRankSlice = createSlice({
  name: "communityDetailTipsRank",
  initialState: communityDetailTipsRankState,
  reducers: {
    addManyItems: (
      state: CommunityDetailTipsRankState,
      action: PayloadAction<{
        channelId: string;
        items: CommunityTipsRankData;
      }>,
    ) => {
      const { channelId, items } = action.payload;
      if (!state.groupData[channelId]) {
        state.groupData[channelId] = groupDataDefault;
      }
      state.groupData[channelId].items.push(...items);
    },
    setPageInfo: (
      state: CommunityDetailTipsRankState,
      action: PayloadAction<{
        channelId: string;
        pageInfo: {
          hasNextPage: boolean;
          nextPageNumber: number;
        };
      }>,
    ) => {
      const { channelId, pageInfo } = action.payload;
      if (!state.groupData[channelId]) {
        state.groupData[channelId] = groupDataDefault;
      }
      state.groupData[channelId].pageInfo = pageInfo;
    },
    setLoading: (
      state: CommunityDetailTipsRankState,
      action: PayloadAction<{
        channelId: string;
        loading: boolean;
      }>,
    ) => {
      const { channelId, loading } = action.payload;
      if (!state.groupData[channelId]) {
        state.groupData[channelId] = groupDataDefault;
      }
      state.groupData[channelId].loading = loading;
    },
  },
});

const { actions, reducer } = communityDetailTipsRankSlice;
export const { addManyItems, setPageInfo, setLoading } = actions;
export const selectCommunityDetailTipsRank = (state: RootState) =>
  state.communityDetailTipsRank;
export default reducer;
