import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { getProposals, getRound, ProposalsInfo } from "./proposal-helper";

export default function useRoundProposals({
  contractAddress,
  castHash,
}: {
  contractAddress: Address;
  castHash: string;
}) {
  const publicClient = usePublicClient();
  const account = useAccount();
  const walletAddress = account?.address;
  const [allowedParticipate, setAllowedParticipate] = useState<boolean>(false);
  const [proposals, setProposals] = useState<ProposalsInfo>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  const isRejected = status === "error";
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setStatus("pending");
        console.log({
          publicClient,
          contractAddress,
          castHash,
        });
        const proposals = await getProposals({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        setProposals(proposals);
        const roundIndex = proposals.roundIndex;
        const allowedParticipate = await getRound({
          publicClient: publicClient!,
          contractAddress,
          castHash,
          roundIndex,
          walletAddress: walletAddress!,
        });
        setAllowedParticipate(allowedParticipate);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getRoundProposals error", error);
      }
    };
    if (status === "idle") {
      fetchProposals();
    }
  }, [publicClient, contractAddress, walletAddress, castHash, status]);
  return {
    proposals,
    allowedParticipate,
    error,
    isLoading,
    isRejected,
  };
}
