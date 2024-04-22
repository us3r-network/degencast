import { base } from "viem/chains";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const FARCASTER_API_URL = process.env.EXPO_PUBLIC_FARCASTER_API_URL;

export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || "";
export const EXPO_PUBLIC_ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY || "demo"

export const DEFAULT_CHAIN = base
export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000"; //ETH
export const DEGEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export const DEFAULT_HEADER_HEIGHT = 64;