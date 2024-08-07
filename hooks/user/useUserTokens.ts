import { useMemo } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useBalance, useReadContracts } from "wagmi";
import {
  DEFAULT_CHAINID,
  DEGEN_TOKEN_METADATA,
  DEGEN_TOKEN_ADDRESS,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import { TokenWithTradeInfo } from "~/services/trade/types";

export enum TOKENS {
  NATIVE = "native",
  DEGEN = "degen",
}

export default function useUserTokens(
  address: `0x${string}` | undefined,
  chainId: number = DEFAULT_CHAINID,
) {
  if (!address || !chainId)
    return { userTokens: new Map<TOKENS, TokenWithTradeInfo>() };
  const { data: nativeToken } = useBalance({
    address,
    chainId,
  });
  const { data: degenToken } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEGEN_TOKEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: DEGEN_TOKEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: DEGEN_TOKEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: DEGEN_TOKEN_ADDRESS,
        chainId,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  // console.log("balance: ", nativeToken, degenToken);

  const userTokens: Map<TOKENS, TokenWithTradeInfo> = useMemo(() => {
    const tokens = new Map<TOKENS, TokenWithTradeInfo>();
    if (nativeToken)
      tokens.set(TOKENS.NATIVE, {
        ...nativeToken,
        chainId: DEFAULT_CHAINID,
        address: NATIVE_TOKEN_METADATA.address,
        name: NATIVE_TOKEN_METADATA.name,
        rawBalance: nativeToken.value,
        balance: formatUnits(nativeToken.value, nativeToken.decimals),
        logoURI: NATIVE_TOKEN_METADATA.logoURI,
      });
    if (degenToken)
      tokens.set(TOKENS.DEGEN, {
        chainId: DEFAULT_CHAINID,
        address: DEGEN_TOKEN_METADATA.address,
        name: degenToken[0],
        rawBalance: degenToken[1],
        decimals: degenToken[2],
        balance: formatUnits(degenToken[1], degenToken[2]),
        symbol: degenToken[3],
        logoURI: DEGEN_TOKEN_METADATA.logoURI,
      });
    return tokens;
  }, [nativeToken, degenToken]);

  return {
    userTokens,
  };
}

export function useUserNativeToken(
  address: `0x${string}` | undefined,
  chainId: number = DEFAULT_CHAINID,
  disable: boolean = false,
) {
  if (!address || !chainId || disable) return undefined;
  // console.log("useUserNativeToken", address, chainId);
  const { data } = useBalance({
    address,
    chainId,
  });
  const token: TokenWithTradeInfo | undefined = useMemo(
    () =>
      data && {
        ...data,
        chainId: DEFAULT_CHAINID,
        address: NATIVE_TOKEN_METADATA.address,
        name: NATIVE_TOKEN_METADATA.name,
        rawBalance: data.value,
        balance: formatUnits(data.value, data.decimals),
        logo: NATIVE_TOKEN_METADATA.logoURI,
      },
    [data],
  );
  return token;
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
    return undefined;
  // console.log("useUserToken", address, contractAddress, chainId);
  const { data } = useReadContracts({
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
          }
        : undefined,
    [data],
  );
  return token;
}
