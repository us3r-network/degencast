import { FarcasterNetwork } from "@external-types/farcaster";

export const FARCASTER_NETWORK =
  process.env.EXPO_PUBLIC_FARCASTER_NETWORK === "testnet"
    ? FarcasterNetwork.TESTNET
    : FarcasterNetwork.MAINNET;

export const FARCASTER_HUB_URL = process.env.EXPO_PUBLIC_FARCASTER_HUB_URL;
export const NEYNAR_API_KEY = process.env.EXPO_PUBLIC_NEYNAR_API_KEY;
export const WARRPCAST = "https://warpcast.com";
export const DEGENCAST_FRAME_HOST = process.env.EXPO_PUBLIC_DEGENCAST_FRAME_HOST || "https://frame.degencast.xyz"