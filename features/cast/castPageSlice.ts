import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { FarCast } from "~/services/farcaster/types";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

export enum CastDetailDataOrigin {
  Explore,
  ChannelCastExplore,
  Comments,
  Community,
  Protfolio,
  Created,
}

export type CastDetailData = {
  cast: NeynarCast;
  proposal?: ProposalEntity;
  channel?: CommunityEntity | null | undefined;
  tokenInfo?: AttentionTokenEntity;
  origin?: CastDetailDataOrigin;
};

export type CastReplayData = {
  cast: NeynarCast;
  community?: CommunityEntity;
};

export type CreateCastPreviewData = {
  posting: boolean;
  castHash?: string;
  cast?: NeynarCast;
};

type castPageState = {
  castDetailData: CastDetailData | null;
  castReplyData: CastReplayData | null;
  castReplyRecordData: {
    [key: string]: Array<CastReplayData>;
  };
  createCastPreviewData: CreateCastPreviewData | null;
};

const castPageState: castPageState = {
  castDetailData: null,
  castReplyData: null,
  castReplyRecordData: {},
  createCastPreviewData: null,
};

export const castPageSlice = createSlice({
  name: "castPage",
  initialState: castPageState,
  reducers: {
    setCastDetailData: (
      state: castPageState,
      action: PayloadAction<CastDetailData | null>,
    ) => {
      state.castDetailData = action.payload;
    },
    updateCastDetailData: (
      state: castPageState,
      action: PayloadAction<CastDetailData>,
    ) => {
      const oldData = state.castDetailData;

      if (
        !!oldData?.cast?.hash &&
        oldData.cast.hash === action.payload.cast?.hash
      ) {
        state.castDetailData = {
          ...oldData,
          ...action.payload,
        };
      } else {
        state.castDetailData = {
          ...action.payload,
        };
      }
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
    upsertCreateCastPreviewData: (
      state: castPageState,
      action: PayloadAction<CreateCastPreviewData>,
    ) => {
      const oldData = state.createCastPreviewData;
      state.createCastPreviewData = {
        ...oldData,
        ...action.payload,
      };
    },
  },
});

const { actions, reducer } = castPageSlice;
export const {
  setCastDetailData,
  updateCastDetailData,
  setCastReplyData,
  addCastReplyRecordData,
  upsertCreateCastPreviewData,
} = actions;
export const selectCastPage = (state: RootState) => state.castPage;
export default reducer;
