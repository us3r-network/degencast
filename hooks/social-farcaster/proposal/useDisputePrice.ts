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
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setStatus("pending");
        if (!publicClient) {
          throw new Error("Client not connected");
        }
        const price = await getDisputePrice({
          publicClient,
          contractAddress,
          castHash,
        });
        setPrice(price);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
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
  };
}
