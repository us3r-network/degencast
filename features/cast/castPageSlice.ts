import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export enum CastDetailDataOrigin {
  Explore,
  ChannelCastExplore,
  Comments,
  Community,
  Protfolio,
  Created,
}

export type CastDetailData = {
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: {
    [key: string]: UserData;
  };
  community?: CommunityInfo | null | undefined;
  origin?: CastDetailDataOrigin;
};

export type CastReplayData = {
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: {
    [key: string]: UserData;
  };
  community?: CommunityInfo;
};

type castPageState = {
  castDetailData: {
    [key: string]: CastDetailData;
  };
  castReplyData: CastReplayData | null;
  castReplyRecordData: {
    [key: string]: Array<CastReplayData>;
  };
};

const castPageState: castPageState = {
  castDetailData: {},
  castReplyData: null,
  castReplyRecordData: {},
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
    addCastReplyRecordData: (
      state: castPageState,
      action: PayloadAction<{
        id: string;
        params: CastReplayData;
      }>,
    ) => {
      if (!state.castReplyRecordData[action.payload.id]) {
        state.castReplyRecordData[action.payload.id] = [];
      }
      state.castReplyRecordData[action.payload.id].unshift(
        action.payload.params,
      );
    },
  },
});

const { actions, reducer } = castPageSlice;
export const {
  upsertToCastDetailData,
  setCastReplyData,
  addCastReplyRecordData,
} = actions;
export const selectCastPage = (state: RootState) => state.castPage;
export default reducer;
