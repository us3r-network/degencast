import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { getPaymentToken } from "./proposal-helper";

export default function usePaymentTokenAddress({
  contractAddress,
  castHash,
}: {
  contractAddress: Address;
  castHash: string;
}) {
  const publicClient = usePublicClient();
  const [paymentTokenAddress, setPaymentTokenAddress] =
    useState<`0x${string}`>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  useEffect(() => {
    const fetchTokenAddress = async () => {
      try {
        setStatus("pending");
        const paymentTokenAddress = await getPaymentToken({
          publicClient: publicClient!,
          contractAddress,
        });
        setPaymentTokenAddress(paymentTokenAddress);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getPaymentToken error", error);
      }
    };
    if (status === "idle") {
      fetchTokenAddress();
    }
  }, [publicClient, contractAddress, castHash, status]);
  return {
    paymentTokenAddress,
    error,
    isLoading,
  };
}
