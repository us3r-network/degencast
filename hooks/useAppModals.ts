import { useCallback } from "react";
import {
  ProposalShareModal,
  selectAppModals,
  upsertProposalShareModal,
} from "~/features/appModalsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppModals() {
  const dispatch = useAppDispatch();
  const { proposalShareModal } = useAppSelector(selectAppModals);

  const upsertProposalShareModalAction = useCallback(
    (data: ProposalShareModal) => {
      dispatch(upsertProposalShareModal(data));
    },
    [],
  );

  return {
    proposalShareModal,
    upsertProposalShareModal: upsertProposalShareModalAction,
  };
}
