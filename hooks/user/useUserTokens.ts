import { useMemo } from "react";
import { erc20Abi, formatUnits } from "viem";
import { base } from "viem/chains";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { DEFAULT_CHAIN, NATIVE_TOKEN } from "~/constants";
import { TokenInfoWithMetadata } from "~/services/user/types";

export enum TOKENS {
  NATIVE = "native",
  DEGEN = "degen",
}

const DEGEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export default function useUserTokens(chainId: number = base.id) {
  const { address } = useAccount();
  const { data: nativeToken } = useBalance({
    address,
    chainId,
  });
  const { data: degenToken } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  // console.log("balance: ", nativeToken, degenToken);

  const userTokens: Map<TOKENS, TokenInfoWithMetadata> = useMemo(() => {
    const tokens = new Map<TOKENS, TokenInfoWithMetadata>();
    if (nativeToken)
      tokens.set(TOKENS.NATIVE, {
        chainId: DEFAULT_CHAIN.id,
        contractAddress: NATIVE_TOKEN,
        name: "ETH",
        rawBalance: nativeToken.value,
        decimals: nativeToken.decimals,
        balance: formatUnits(nativeToken.value, nativeToken.decimals),
        symbol: nativeToken.symbol,
        logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      });
    if (degenToken)
      tokens.set(TOKENS.DEGEN, {
        chainId: DEFAULT_CHAIN.id,
        contractAddress: DEGEN_ADDRESS,
        name: degenToken[0],
        rawBalance: degenToken[1],
        decimals: degenToken[2],
        balance: formatUnits(degenToken[1], degenToken[2]),
        symbol: degenToken[3],
        logo: "https://i.imgur.com/qLrLl4y_d.webp",
      });
    return tokens;
  }, [nativeToken, degenToken]);

  return {
    userTokens,
  };
}
