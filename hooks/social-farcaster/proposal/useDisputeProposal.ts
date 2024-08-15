import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { disputeProposal, getProposals } from "./proposal-helper";
import useCacheCastProposal from "./useCacheCastProposal";
import { walletActionsEip5792 } from "viem/experimental";
import { ProposalEntity } from "~/services/feeds/types/proposal";

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
  const dispute = useCallback(
    async (paymentConfig: {
      paymentPrice: bigint;
      enableApprovePaymentStep?: boolean; // 开启后，尝试在create前先批准支付
      paymentTokenAddress?: `0x${string}`;
    }) => {
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

        const proposals = await getProposals({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        upsertOneToProposals(castHash as any, {
          status: proposals.state,
          finalizeTime: Number(proposals.deadline),
          roundIndex: Number(proposals.roundIndex),
          downvoteCount: Number(proposal?.downvoteCount) + 1,
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
