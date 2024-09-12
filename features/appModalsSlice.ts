import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { RootState } from "~/store/store";

export type ProposalShareModal = {
  open: boolean;
  cast?: NeynarCast | null;
  channel?: CommunityEntity | null;
  proposal?: ProposalEntity | null;
};

export type ChannelShareModal = {
  open: boolean;
  channelId?: string;
  name?: string;
};

export type TradeTokenModal = {
  open: boolean;
  token1?: TokenWithTradeInfo | null;
  token2?: TokenWithTradeInfo | null;
};

export type AppModalsState = {
  proposalShareModal: ProposalShareModal;
  channelShareModal: ChannelShareModal;
  tradeTokenModal: TradeTokenModal;
};

export const appModalsStateDefalut: AppModalsState = {
  proposalShareModal: {
    open: false,
    cast: null,
    channel: null,
  },
  channelShareModal: {
    open: false,
    channelId: "",
    name: "",
  },
  tradeTokenModal: {
    open: false,
    token1: null,
    token2: null,
  },
};

export const appModalsSlice = createSlice({
  name: "appModals",
  initialState: appModalsStateDefalut,
  reducers: {
    upsertProposalShareModal: (
      state,
      action: PayloadAction<{ open: boolean; castHash?: string }>,
    ) => {
      state.proposalShareModal = {
        ...state.proposalShareModal,
        ...action.payload,
      };
    },
    setTradeTokenModal: (state, action: PayloadAction<TradeTokenModal>) => {
      state.tradeTokenModal = {
        ...action.payload,
      };
    },
    setChannelShareModal: (state, action: PayloadAction<ChannelShareModal>) => {
      state.channelShareModal = {
        ...action.payload,
      };
    },
  },
});

const { actions, reducer } = appModalsSlice;
export const {
  upsertProposalShareModal,
  setTradeTokenModal,
  setChannelShareModal,
} = actions;
export const selectAppModals = (state: RootState) => state.appModals;
export default reducer;
