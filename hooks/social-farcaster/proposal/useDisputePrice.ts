import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { getDisputePrice } from "./proposal-helper";

export default function useDisputePrice({
  contractAddress,
  castHash,
}: {
  contractAddress: Address;
  castHash: string;
}) {
  const publicClient = usePublicClient();
  const [price, setPrice] = useState<bigint>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  const isRejected = status === "error";
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setStatus("pending");
        const price = await getDisputePrice({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        setPrice(price);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getDisputePrice error", error);
      }
    };
    if (status === "idle") {
      fetchPrice();
    }
  }, [publicClient, contractAddress, castHash, status]);
  return {
    price,
    error,
    isLoading,
    isRejected,
  };
}
