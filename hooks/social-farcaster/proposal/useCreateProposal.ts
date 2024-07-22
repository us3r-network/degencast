import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { createProposal } from "./proposal-helper";

export default function useCreateProposal({
  contractAddress,
}: {
  contractAddress: Address;
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
  const create = useCallback(
    async (proposalConfig: {
      castHash: string;
      castCreator: string;
      contentURI: string;
    }) => {
      try {
        setStatus("pending");
        if (!publicClient || !walletClient) {
          throw new Error("Client not connected");
        }
        const { receipt } = await createProposal({
          publicClient,
          walletClient,
          contractAddress,
          proposalConfig,
        });
        setTransactionReceipt(receipt);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
      }
    },
    [contractAddress, publicClient, walletClient],
  );
  return {
    create,
    error,
    isLoading,
    transactionReceipt,
  };
}
