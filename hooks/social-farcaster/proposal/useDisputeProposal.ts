import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { disputeProposal, getProposals } from "./proposal-helper";
import useCacheCastProposal from "./useCacheCastProposal";

export default function useDisputeProposal({
  contractAddress,
  castHash,
  onDisputeSuccess,
  onDisputeError,
}: {
  contractAddress: Address;
  castHash: string;
  onDisputeSuccess?: (proposal: TransactionReceipt) => void;
  onDisputeError?: (error: any) => void;
}) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";

  const { upsertOneToProposals } = useCacheCastProposal();
  const dispute = useCallback(async () => {
    try {
      setStatus("pending");
      const { receipt } = await disputeProposal({
        publicClient: publicClient!,
        walletClient: walletClient!,
        contractAddress,
        castHash,
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
      });
    } catch (error) {
      setError(error);
      setStatus("error");
      onDisputeError?.(error);
      console.error("disputeProposal error", error);
    }
  }, [
    contractAddress,
    publicClient,
    walletClient,
    onDisputeSuccess,
    onDisputeError,
  ]);
  return {
    dispute,
    error,
    isLoading,
    transactionReceipt,
  };
}
