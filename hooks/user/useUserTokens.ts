import { FeeAmount } from "@uniswap/v3-sdk";
import { useEffect, useMemo } from "react";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useBalance, useReadContracts } from "wagmi";
import {
  DEFAULT_CHAINID,
  NATIVE_TOKEN_METADATA,
  USDT_TOKEN_ADDRESS,
  USDT_TOKEN_METADATA,
  WRAP_NATIVE_TOKEN_ADDRESS,
  WRAP_NATIVE_TOKEN_METADATA
} from "~/constants";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { useSwap } from "../trade/useUniSwapV3";

export function useUserNativeToken(
  address: `0x${string}` | undefined,
  chainId: number = DEFAULT_CHAINID,
) {
  if (!address || !chainId) return { token: undefined };
  // console.log("useUserNativeToken", address, chainId);
  const { data, refetch } = useBalance({
    address,
    chainId,
  });
  const {
    fetchSellAmount,
    sellAmount: usdPrice,
    ready: swapReady,
  } = useSwap({
    buyToken: { address: WRAP_NATIVE_TOKEN_ADDRESS, chainId }!,
    sellToken: { address: USDT_TOKEN_ADDRESS, chainId },
    poolFee: FeeAmount.MEDIUM,
  });
  useEffect(() => {
    if (swapReady) {
      fetchSellAmount(parseUnits("1", WRAP_NATIVE_TOKEN_METADATA.decimals!));
    }
  }, [swapReady]);

  const token: TokenWithTradeInfo | undefined = useMemo(
    () =>
      data && {
        ...data,
        chainId: NATIVE_TOKEN_METADATA.chainId,
        address: NATIVE_TOKEN_METADATA.address,
        name: NATIVE_TOKEN_METADATA.name,
        rawBalance: data.value,
        balance: formatUnits(data.value, data.decimals),
        logoURI: NATIVE_TOKEN_METADATA.logoURI,
        usdPrice: usdPrice
          ? Number(formatUnits(usdPrice, USDT_TOKEN_METADATA.decimals!))
          : undefined,
      },
    [data],
  );
  return { token, refetch };
}

export function useUserToken(
  address?: `0x${string}` | undefined,
  contractAddress?: `0x${string}` | undefined,
  chainId: number = DEFAULT_CHAINID,
) {
  // console.log("useUserToken", address, contractAddress, chainId);
  if (
    !address ||
    !chainId ||
    !contractAddress ||
    contractAddress === NATIVE_TOKEN_METADATA.address
  )
    return { token: undefined };
  // console.log("useUserToken", address, contractAddress, chainId);
  const { data, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: contractAddress,
        chainId,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: contractAddress,
        chainId,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: contractAddress,
        chainId,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: contractAddress,
        chainId,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  // const {
  //   fetchSellAmount,
  //   sellAmount: usdPrice,
  //   ready: swapReady,
  // } = useSwap({
  //   buyToken: { address, chainId }!,
  //   sellToken: { address: USDT_TOKEN_ADDRESS, chainId },
  //   poolFee: FeeAmount.MEDIUM,
  // });
  // useEffect(() => {
  //   if (swapReady) {
  //     fetchSellAmount(parseUnits("1", USDT_TOKEN_METADATA.decimals!));
  //   }
  // }, [swapReady]);
  const token: TokenWithTradeInfo | undefined = useMemo(
    () =>
      data && data?.length >= 4
        ? {
            chainId,
            address: contractAddress,
            name: data[0],
            rawBalance: data[1],
            decimals: data[2],
            balance: formatUnits(data[1], data[2]),
            symbol: data[3],
            // usdPrice: usdPrice
            //   ? Number(formatUnits(usdPrice, USDT_TOKEN_METADATA.decimals!))
            //   : undefined,
          }
        : undefined,
    [data],
  );
  return { token, refetch };
}
