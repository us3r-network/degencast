import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedToken } from "alchemy-sdk";
import { EXPO_PUBLIC_ALCHEMY_API_KEY } from "~/constants";
import { formatUnits, fromHex } from "viem";

const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
  network: Network.BASE_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

export default function useUserTokens(
  address: string,
  contractAddresses: string[],
) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const [nativeTokens, setNativeTokens] = useState<OwnedToken[]>([]);

  const getERC20Tokens = useCallback(async () => {
    if (!address || !contractAddresses) return;
    const options = {
      contractAddresses,
    };
    const resp = await alchemy.core.getTokensForOwner(address, options);
    if (resp?.tokens) {
      setTokens(resp.tokens);
    } else {
      throw new Error("something went wrong!");
    }
  }, [address, contractAddresses]);

  const getBalance = useCallback(async () => {
    if (!address) return;
    const resp = await alchemy.core.getBalance(address, "latest");
    if (resp._hex) {
      const nativeToken: OwnedToken = {
        contractAddress: "0x",
        decimals: 18,
        rawBalance: fromHex(resp._hex as `0x${string}`, "bigint").toString(),
        balance: formatUnits(
          fromHex(resp._hex as `0x${string}`, "bigint"),
          18,
        ),
        symbol: "ETH",
        name: "Ethereum",
        logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      };
      setNativeTokens([nativeToken]);
    } else {
      throw new Error("something went wrong!");
    }
  }, [address]);

  // useEffect(() => {
  //   getERC20Tokens().catch(console.error);
  //   getBalance().catch(console.error);
  // }, [getERC20Tokens, getBalance]);

  return {
    nativeTokens,
    tokens,
    getERC20Tokens,
    getBalance,
  };
}
