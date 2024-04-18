import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";

export enum CastDetailDataOrigin {
  Explore,
  Comments,
  Community,
  Protfolio,
  Created,
}

export type CastDetailData = {
  origin: CastDetailDataOrigin;
  cast: FarCast;
  farcasterUserDataObj: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
};

export type CastReplayData = {
  cast: FarCast;
  farcasterUserDataObj: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
};

type castPageState = {
  castDetailData: {
    [key: string]: CastDetailData;
  };
  castReplyData: CastReplayData | null;
};

const castPageState: castPageState = {
  castDetailData: {},
  castReplyData: null,
};

export const castPageSlice = createSlice({
  name: "castPage",
  initialState: castPageState,
  reducers: {
    upsertToCastDetailData: (
      state: castPageState,
      action: PayloadAction<{
        id: string;
        params: CastDetailData;
      }>,
    ) => {
      state.castDetailData[action.payload.id] = action.payload.params;
    },
    setCastReplyData: (
      state: castPageState,
      action: PayloadAction<CastReplayData | null>,
    ) => {
      state.castReplyData = action.payload;
    },
  },
});

const { actions, reducer } = castPageSlice;
export const { upsertToCastDetailData, setCastReplyData } = actions;
export const selectCastPage = (state: RootState) => state.castPage;
export default reducer;
