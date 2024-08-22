import { useCallback } from "react";
import {
  ProposalShareModal,
  selectAppModals,
  upsetProposalShareModal,
} from "~/features/appModalsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppModals() {
  const dispatch = useAppDispatch();
  const { proposalShareModal } = useAppSelector(selectAppModals);

  const upsetProposalShareModalAction = useCallback(
    (data: ProposalShareModal) => {
      dispatch(upsetProposalShareModal(data));
    },
    [],
  );

  return {
    proposalShareModal,
    upsetProposalShareModal: upsetProposalShareModalAction,
  };
}
