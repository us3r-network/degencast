import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { getProposals, ProposalsInfo } from "./proposal-helper";

export default function useProposals({
  contractAddress,
  castHash,
}: {
  contractAddress: Address;
  castHash: string;
}) {
  const publicClient = usePublicClient();
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
        const newProposals = await getProposals({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        setProposals(newProposals);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getProposals error", error);
      }
    };
    if (status === "idle") {
      fetchProposals();
    }
  }, [publicClient, contractAddress, castHash, status]);

  return {
    proposals,
    error,
    isLoading,
    isRejected,
  };
}
