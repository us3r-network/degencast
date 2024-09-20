import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { createProposal, getProposals, PaymentConfig } from "./proposal-helper";
import { arCheckCastProposalMetadata } from "~/services/upload";
import { ApiRespCode } from "~/services/shared/types";
import useCacheCastProposal from "./useCacheCastProposal";
import { walletActionsEip5792 } from "viem/experimental";

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
  const { data: walletClientBase } = useWalletClient();
  const walletClient = walletClientBase
    ? walletClientBase.extend(walletActionsEip5792())
    : walletClientBase;
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  const { upsertOneToProposals } = useCacheCastProposal();
  const create = useCallback(
    async (
      proposalConfig: {
        castHash: string;
        castCreator: `0x${string}`;
      },
      paymentConfig: PaymentConfig,
    ) => {
      console.log("createProposal", proposalConfig, paymentConfig);
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
            paymentConfig,
          });
          setTransactionReceipt(receipt);
          setStatus("success");
          onCreateProposalSuccess?.(receipt);
          const proposals = await getProposals({
            publicClient,
            contractAddress,
            castHash: proposalConfig.castHash,
          });
          console.log("proposals", proposals);

          upsertOneToProposals(proposalConfig.castHash as any, {
            status: proposals.state,
            finalizeTime: Number(proposals.deadline),
            upvoteCount: 1,
            roundIndex: Number(proposals.roundIndex),
          });
        } else {
          throw new Error("Cast proposal metadata not found");
        }
      } catch (e) {
        let err = e as any;
        setError(err);
        setStatus("error");
        onCreateProposalError?.(err);
        console.error("createProposal error", err);
      }
    },
    [
      contractAddress,
      publicClient,
      walletClient,
      onCreateProposalSuccess,
      onCreateProposalError,
      upsertOneToProposals,
    ],
  );
  return {
    create,
    error,
    isLoading,
    transactionReceipt,
  };
}
