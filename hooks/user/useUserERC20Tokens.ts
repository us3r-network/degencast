import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedToken } from "alchemy-sdk";
import { EXPO_PUBLIC_ALCHEMY_API_KEY } from "~/constants";
import { myTokens } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";

const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
  network: Network.BASE_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

export default function useUserERC20Tokens() {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);

  const fetch = async (address: string, contractAddresses: string[]) => {
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
  };

  // useEffect(() => {
  //   fetch().catch(console.error);
  // }, [fetch]);

  return {
    tokens,
    fetch,
  };
}
