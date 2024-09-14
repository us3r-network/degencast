import { useCallback } from "react";
import {
  ChannelShareModal,
  ProposalShareModal,
  selectAppModals,
  setChannelShareModal,
  setTradeTokenModal,
  TradeTokenModal,
  upsertProposalShareModal,
} from "~/features/appModalsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppModals() {
  const dispatch = useAppDispatch();
  const { proposalShareModal, tradeTokenModal, channelShareModal } =
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

  const setChannelShareModalAction = useCallback((data: ChannelShareModal) => {
    dispatch(setChannelShareModal(data));
  }, []);

  return {
    proposalShareModal,
    tradeTokenModal,
    channelShareModal,
    upsertProposalShareModal: upsertProposalShareModalAction,
    setTradeTokenModal: setTradeTokenModalAction,
    setChannelShareModal: setChannelShareModalAction,
  };
}
