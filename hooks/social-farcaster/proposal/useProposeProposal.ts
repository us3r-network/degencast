import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { proposeProposal } from "./proposal-helper";

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
  const { data: walletClient } = useWalletClient();
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  const propose = useCallback(async () => {
    try {
      setStatus("pending");
      const { receipt } = await proposeProposal({
        publicClient: publicClient!,
        walletClient: walletClient!,
        contractAddress,
        castHash,
      });
      setTransactionReceipt(receipt);
      setStatus("success");
      onProposeSuccess?.(receipt);
    } catch (error) {
      setError(error);
      setStatus("error");
      onProposeError?.(error);
      console.error("proposeProposal error", error);
    }
  }, [
    contractAddress,
    castHash,
    publicClient,
    walletClient,
    onProposeSuccess,
    onProposeError,
  ]);
  return {
    propose,
    error,
    isLoading,
    transactionReceipt,
  };
}
