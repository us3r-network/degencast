import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedToken } from "alchemy-sdk";
import { EXPO_PUBLIC_ALCHEMY_API_KEY } from "~/constants";

const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
  network: Network.BASE_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

export default function useUserERC20Tokens(
  address: string,
  contractAddresses: string[],
) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);

  const fetch = useCallback(async () => {
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

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);

  return {
    tokens
  };
}
