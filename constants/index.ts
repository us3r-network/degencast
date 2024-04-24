import { base } from "viem/chains";
import { TokenInfoWithMetadata } from "~/services/user/types";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const FARCASTER_API_URL = process.env.EXPO_PUBLIC_FARCASTER_API_URL;

export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || "";
export const EXPO_PUBLIC_ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY || "demo"

export const DEFAULT_CHAIN = base
export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; //ETH
export const DEGEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export const NATIVE_TOKEN_METADATA: TokenInfoWithMetadata = {
    chainId: DEFAULT_CHAIN.id,
    contractAddress: NATIVE_TOKEN_ADDRESS,
    name: "ETH",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  };

  export const DEGEN_METADATA: TokenInfoWithMetadata = {
    chainId: DEFAULT_CHAIN.id,
    contractAddress: DEGEN_ADDRESS,
    name: "DEGEN",
    logo: "https://i.imgur.com/qLrLl4y_d.webp",
  };

export const DEFAULT_HEADER_HEIGHT = 64;