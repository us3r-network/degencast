import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedToken } from "alchemy-sdk";
import { EXPO_PUBLIC_ALCHEMY_API_KEY } from "~/constants";
import { formatUnits, fromHex } from "viem";

const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
  network: Network.BASE_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

export default function useUserBalance(
  address: string,
) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);

  const fetch = useCallback(async () => {
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
      setTokens([nativeToken]);
    } else {
      throw new Error("something went wrong!");
    }
  }, [address]);

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);
  
  return {
    tokens
  };
}
