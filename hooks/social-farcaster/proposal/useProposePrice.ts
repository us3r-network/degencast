import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { getProposePrice } from "./proposal-helper";

export default function useProposePrice({
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
        console.log({
          publicClient,
          contractAddress,
          castHash,
        });
        const price = await getProposePrice({
          publicClient: publicClient!,
          contractAddress,
          castHash,
        });
        setPrice(price);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getProposePrice error", error);
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
