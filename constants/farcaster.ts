import { FarcasterNetwork } from "@farcaster/hub-web";

export const FARCASTER_NETWORK =
  process.env.EXPO_PUBLIC_FARCASTER_NETWORK === "testnet"
    ? FarcasterNetwork.TESTNET
    : FarcasterNetwork.MAINNET;
