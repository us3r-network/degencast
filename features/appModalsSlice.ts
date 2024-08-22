import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { RootState } from "~/store/store";

export type ProposalShareModal = {
  open: boolean;
  cast?: NeynarCast | null;
  channel?: CommunityEntity | null;
};
export type AppModalsState = {
  proposalShareModal: ProposalShareModal;
};

export const appModalsStateDefalut: AppModalsState = {
  proposalShareModal: {
    open: false,
    cast: null,
    channel: null,
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
  },
});

const { actions, reducer } = appModalsSlice;
export const { upsertProposalShareModal } = actions;
export const selectAppModals = (state: RootState) => state.appModals;
export default reducer;
