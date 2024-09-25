import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import {
  disputeProposal,
  getProposals,
  PaymentConfig,
} from "./proposal-helper";
import useCacheCastProposal from "./useCacheCastProposal";
import { walletActionsEip5792 } from "viem/experimental";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import useUserAction from "~/hooks/user/useUserAction";
import { UserActionName } from "~/services/user/types";

export default function useDisputeProposal({
  contractAddress,
  castHash,
  proposal,
  onDisputeSuccess,
  onDisputeError,
}: {
  contractAddress: Address;
  castHash: string;
  proposal?: ProposalEntity;
  onDisputeSuccess?: (proposal: TransactionReceipt) => void;
  onDisputeError?: (error: any) => void;
}) {
  const publicClient = usePublicClient();
  const { data: walletClientBase } = useWalletClient();
  const walletClient = walletClientBase
    ? walletClientBase.extend(walletActionsEip5792())
    : undefined;
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";

  const { upsertOneToProposals } = useCacheCastProposal();
  const { submitUserAction } = useUserAction();

  const dispute = useCallback(
    async (paymentConfig: PaymentConfig) => {
      try {
        setStatus("pending");
        const { receipt } = await disputeProposal({
          publicClient: publicClient!,
          walletClient: walletClient!,
          contractAddress,
          castHash,
          paymentConfig,
        });
        setTransactionReceipt(receipt);
        setStatus("success");
        onDisputeSuccess?.(receipt);
        submitUserAction({
          action: UserActionName.VoteCast,
          castHash: castHash,
          data: {
            hash: receipt.transactionHash,
          },
        });

        const proposals = await getProposals({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        upsertOneToProposals(castHash as any, {
          status: proposals.state,
          finalizeTime: Number(proposals.deadline),
          roundIndex: Number(proposals.roundIndex),
          downvoteCount: Number(proposal?.downvoteCount || 0) + 1,
        });
      } catch (error) {
        setError(error);
        setStatus("error");
        onDisputeError?.(error);
        console.error("disputeProposal error", error);
      }
    },
    [
      contractAddress,
      proposal,
      publicClient,
      walletClient,
      onDisputeSuccess,
      onDisputeError,
    ],
  );
  return {
    dispute,
    error,
    isLoading,
    transactionReceipt,
  };
}
