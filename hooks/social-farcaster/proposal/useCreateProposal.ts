import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { createProposal } from "./proposal-helper";
import { arCheckCastProposalMetadata } from "~/services/upload";
import { ApiRespCode } from "~/services/shared/types";

export default function useCreateProposal({
  contractAddress,
  onCreateProposalSuccess,
  onCreateProposalError,
}: {
  contractAddress: Address;
  onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
  onCreateProposalError?: (error: any) => void;
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
    async (
      proposalConfig: {
        castHash: string;
        castCreator: `0x${string}`;
      },
      paymentPrice: bigint,
    ) => {
      try {
        setStatus("pending");
        if (!publicClient || !walletClient) {
          throw new Error("Client not connected");
        }
        if (!proposalConfig.castHash) {
          throw new Error("Cast hash is required");
        }
        if (!proposalConfig.castCreator) {
          throw new Error("Cast creator address is required");
        }
        const arRes = await arCheckCastProposalMetadata(
          proposalConfig.castHash,
        );
        const { data, code } = arRes.data;
        if (code === ApiRespCode.SUCCESS && !!data.arUrl) {
          const { arUrl } = data;
          const { receipt } = await createProposal({
            publicClient,
            walletClient,
            contractAddress,
            proposalConfig: {
              ...proposalConfig,
              contentURI: arUrl,
            },
            paymentPrice,
          });
          setTransactionReceipt(receipt);
          setStatus("success");
          onCreateProposalSuccess?.(receipt);
        } else {
          throw new Error("Cast proposal metadata not found");
        }
      } catch (error) {
        setError(error);
        setStatus("error");
        onCreateProposalError?.(error);
        console.error("createProposal error", error);
      }
    },
    [
      contractAddress,
      publicClient,
      walletClient,
      onCreateProposalSuccess,
      onCreateProposalError,
    ],
  );
  return {
    create,
    error,
    isLoading,
    transactionReceipt,
  };
}
