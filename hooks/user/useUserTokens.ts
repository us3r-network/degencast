import { useCallback, useEffect, useState } from 'react';
import { Alchemy, Network, OwnedToken } from "alchemy-sdk"
import { EXPO_PUBLIC_ALCHEMY_API_KEY } from '~/constants';

const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
  network: Network.BASE_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

export default function useUserTokens(address: string, contractAddresses: string[]) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const options = {
    contractAddresses
  }
  const getUserTokens = useCallback(async () => {
    const resp = await alchemy.core.getTokensForOwner(address || '0x', options)
    setTokens(resp.tokens);
  }, [address]);

  useEffect(() => {
    getUserTokens().catch(console.error);
  }, [getUserTokens]);

  return {
    tokens
  };
}
