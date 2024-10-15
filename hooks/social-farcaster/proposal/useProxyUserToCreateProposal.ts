import { useCallback, useState } from "react";
import { Address, TransactionReceipt } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import {
  createProposal,
  getProposals,
  PaymentConfig,
  ProposalState,
} from "./proposal-helper";
import { arCheckCastProposalMetadata } from "~/services/upload";
import { ApiRespCode } from "~/services/shared/types";
import useCacheCastProposal from "./useCacheCastProposal";
import { walletActionsEip5792 } from "viem/experimental";
import useUserAction from "~/hooks/user/useUserAction";
import { UserActionName } from "~/services/user/types";
import { proxyUserToCreateProposal } from "~/services/proposal/api";
import useCacheCastAttToken from "./useCacheCastAttToken";

export default function useProxyUserToCreateProposal({
  channelId,
  contractAddress,
  onCreateProposalSuccess,
  onCreateProposalError,
}: {
  channelId?: string;
  contractAddress: Address;
  onCreateProposalSuccess?: () => void;
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
  const { upsertOneToAttTokens } = useCacheCastAttToken();
  const { addOneToReportedActions } = useUserAction();
  const create = useCallback(
    async ({ castHash }: { castHash: string }) => {
      try {
        setStatus("pending");
        if (!publicClient || !walletClient) {
          throw new Error("Client not connected");
        }
        if (!castHash) {
          throw new Error("Cast hash is required");
        }
        // if (!curatorAddr) {
        //   throw new Error("curator address is required");
        // }
        // const res = await proxyUserToCreateProposal({ castHash, curatorAddr });
        const res = await proxyUserToCreateProposal({ castHash });
        // const { code, data, msg } = res.data;
        // if (code === ApiRespCode.SUCCESS) {
        // console.log("createProposal success", data);

        // setTransactionReceipt('');
        setStatus("success");
        onCreateProposalSuccess?.();
        // onCreateProposalSuccess?.(data);
        addOneToReportedActions({
          action: UserActionName.VoteCast,
          castHash: castHash,
        });
        // const proposals = await getProposals({
        //   publicClient,
        //   contractAddress,
        //   castHash,
        // });

        // upsertOneToProposals(castHash as any, {
        //   status: proposals.state,
        //   finalizeTime: Number(proposals.deadline),
        //   upvoteCount: 1,
        //   roundIndex: Number(proposals.roundIndex),
        // });

        const tokenId = res.data?.data?.tokenId;
        if (!!tokenId || tokenId === 0) {
          upsertOneToProposals(castHash as any, {
            status: ProposalState.ReadyToMint,
            tokenId,
          });
        }
        const tokenInfo = res.data?.data;
        if (channelId && tokenInfo.tokenContract) {
          upsertOneToAttTokens(channelId, tokenInfo);
        }

        // } else {
        //   throw new Error(msg);
        // }
      } catch (e) {
        let err = e as any;
        setError(err);
        setStatus("error");
        onCreateProposalError?.(err);
        console.error("createProposal error", err);
      }
    },
    [
      channelId,
      contractAddress,
      publicClient,
      walletClient,
      onCreateProposalSuccess,
      onCreateProposalError,
      upsertOneToProposals,
      upsertOneToAttTokens,
      addOneToReportedActions,
    ],
  );
  return {
    create,
    error,
    isLoading,
    transactionReceipt,
  };
}
