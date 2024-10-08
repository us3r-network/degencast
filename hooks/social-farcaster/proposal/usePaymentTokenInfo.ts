import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { getPaymentToken } from "./proposal-helper";
import { getTokenInfo } from "~/hooks/trade/useERC20Contract";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { TokenWithTradeInfo } from "~/services/trade/types";

export default function usePaymentTokenInfo({
  contractAddress,
}: {
  contractAddress: Address;
}) {
  const account = useAccount();
  const accountAddress = account?.address;
  const publicClient = usePublicClient();
  const [paymentTokenInfo, setPaymentTokenInfo] =
    useState<TokenWithTradeInfo>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const isLoading = status === "pending";
  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (!accountAddress || !contractAddress) return;
        setStatus("pending");
        const paymentTokenAddress = await getPaymentToken({
          publicClient: publicClient!,
          contractAddress,
        });
        if (!paymentTokenAddress) return;
        const tokenInfo = await getTokenInfo({
          address: paymentTokenAddress,
          chainId: ATT_CONTRACT_CHAIN.id,
          account: accountAddress,
        });
        setPaymentTokenInfo(tokenInfo);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
        console.error("getPaymentToken error", error);
      }
    };
    if (status === "idle") {
      fetchToken();
    }
  }, [publicClient, contractAddress, status, accountAddress]);
  const reset = () => {
    setPaymentTokenInfo(undefined);
    setError(undefined);
    setStatus("idle");
  };
  const refetch = () => {
    setStatus("idle");
  };
  return {
    paymentTokenInfo,
    error,
    isLoading,
    reset,
    refetch,
  };
}
