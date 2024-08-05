import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import {
  getProposals,
  ProposalState,
  proposeProposal,
} from "./proposal-helper";
import useCacheCastProposal from "./useCacheCastProposal";
import { walletActionsEip5792 } from "viem/experimental";

export default function useProposeProposal({
  contractAddress,
  castHash,
  onProposeSuccess,
  onProposeError,
}: {
  contractAddress: Address;
  castHash: string;
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
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
  const propose = useCallback(
    async (paymentConfig: {
      paymentPrice: bigint;
      enableApprovePaymentStep?: boolean; // 开启后，尝试在create前先批准支付
      paymentTokenAddress?: `0x${string}`;
    }) => {
      try {
        setStatus("pending");
        const { receipt } = await proposeProposal({
          publicClient: publicClient!,
          walletClient: walletClient!,
          contractAddress,
          castHash,
          paymentConfig,
        });
        setTransactionReceipt(receipt);
        setStatus("success");
        onProposeSuccess?.(receipt);

        const proposals = await getProposals({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        upsertOneToProposals(castHash as any, {
          status: proposals.state,
          finalizeTime: Number(proposals.deadline),
          roundIndex: Number(proposals.roundIndex),
        });
      } catch (error) {
        setError(error);
        setStatus("error");
        onProposeError?.(error);
        console.error("proposeProposal error", error);
      }
    },
    [
      contractAddress,
      castHash,
      publicClient,
      walletClient,
      onProposeSuccess,
      onProposeError,
    ],
  );
  return {
    propose,
    error,
    isLoading,
    transactionReceipt,
  };
}
