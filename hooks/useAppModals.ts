import { useCallback } from "react";
import {
  ProposalShareModal,
  selectAppModals,
  setTradeTokenModal,
  TradeTokenModal,
  upsertProposalShareModal,
} from "~/features/appModalsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppModals() {
  const dispatch = useAppDispatch();
  const { proposalShareModal, tradeTokenModal } =
    useAppSelector(selectAppModals);

  const upsertProposalShareModalAction = useCallback(
    (data: ProposalShareModal) => {
      dispatch(upsertProposalShareModal(data));
    },
    [],
  );

  const setTradeTokenModalAction = useCallback((data: TradeTokenModal) => {
    dispatch(setTradeTokenModal(data));
  }, []);

  return {
    proposalShareModal,
    tradeTokenModal,
    upsertProposalShareModal: upsertProposalShareModalAction,
    setTradeTokenModal: setTradeTokenModalAction,
  };
}
