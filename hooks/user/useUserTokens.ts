import { useMemo } from "react";
import { erc20Abi, formatUnits } from "viem";
import { base } from "viem/chains";
import { useBalance, useReadContracts } from "wagmi";
import {
  DEFAULT_CHAIN,
  DEGEN_ADDRESS,
  DEGEN_METADATA,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import { TokenInfoWithMetadata } from "~/services/user/types";

export enum TOKENS {
  NATIVE = "native",
  DEGEN = "degen",
}

export default function useUserTokens(
  address: `0x${string}` | undefined,
  chainId: number = base.id,
) {
  if (!address) return { userTokens: new Map<TOKENS, TokenInfoWithMetadata>() };
  const { data: nativeToken } = useBalance({
    address,
    chainId,
  });
  const { data: degenToken } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEGEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: DEGEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: DEGEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: DEGEN_ADDRESS,
        chainId,
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
        contractAddress: NATIVE_TOKEN_METADATA.contractAddress,
        name: NATIVE_TOKEN_METADATA.name,
        rawBalance: nativeToken.value,
        decimals: nativeToken.decimals,
        balance: formatUnits(nativeToken.value, nativeToken.decimals),
        symbol: nativeToken.symbol,
        logo: NATIVE_TOKEN_METADATA.logo,
      });
    if (degenToken)
      tokens.set(TOKENS.DEGEN, {
        chainId: DEFAULT_CHAIN.id,
        contractAddress: DEGEN_METADATA.contractAddress,
        name: degenToken[0],
        rawBalance: degenToken[1],
        decimals: degenToken[2],
        balance: formatUnits(degenToken[1], degenToken[2]),
        symbol: degenToken[3],
        logo: DEGEN_METADATA.logo,
      });
    return tokens;
  }, [nativeToken, degenToken]);

  return {
    userTokens,
  };
}
