import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ProposalEntity } from "~/services/feeds/types/proposal";

export type CastProposalState = {
  proposals: {
    [castHex: string]: ProposalEntity;
  };
};

const castProposalState: CastProposalState = {
  proposals: {},
};

export const castProposalSlice = createSlice({
  name: "castProposal",
  initialState: castProposalState,
  reducers: {
    upsertOneToProposals: (
      state,
      action: PayloadAction<{
        castHash: `0x${string}`;
        proposal: ProposalEntity;
      }>,
    ) => {
      const oldVal = state.proposals[action.payload.castHash] || {};
      const upsertVal = action.payload.proposal || {};
      state.proposals[action.payload.castHash] = {
        ...oldVal,
        ...upsertVal,
      };
    },
  },
});

const { actions, reducer } = castProposalSlice;
export const { upsertOneToProposals } = actions;
export const selectCastProposal = (state: RootState) => state.castProposal;
export default reducer;
