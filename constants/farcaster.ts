import { FarcasterNetwork } from "@external-types/farcaster";

export const FARCASTER_NETWORK =
  process.env.EXPO_PUBLIC_FARCASTER_NETWORK === "testnet"
    ? FarcasterNetwork.TESTNET
    : FarcasterNetwork.MAINNET;
