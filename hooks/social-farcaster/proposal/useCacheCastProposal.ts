import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectCastProposal,
  upsertOneToProposals,
} from "~/features/cast/castProposalSlice";
import { ProposalEntity } from "~/services/feeds/types/proposal";

export default function useCacheCastProposal() {
  const dispatch = useAppDispatch();
  const { proposals } = useAppSelector(selectCastProposal);

  const upsertOneToProposalsFn = useCallback(
    (castHash: `0x${string}`, proposal: ProposalEntity) => {
      dispatch(upsertOneToProposals({ castHash, proposal }));
    },
    [],
  );

  const getCachedProposal = useCallback(
    (castHash: `0x${string}`) => {
      return proposals?.[castHash] || null;
    },
    [proposals],
  );
  return {
    proposals,
    upsertOneToProposals: upsertOneToProposalsFn,
    getCachedProposal,
  };
}
