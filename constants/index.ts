import { base } from "viem/chains";
import { TokenWithTradeInfo } from "~/services/trade/types";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const FARCASTER_API_URL = API_BASE_URL;

export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || "";
export const ZERO_X_API_KEY = process.env.EXPO_PUBLIC_ZERO_X_API_KEY || "";

export const DEFAULT_CHAIN = base;
export const NATIVE_TOKEN_ADDRESS: `0x${string}` =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; //ETH
export const DEGEN_ADDRESS: `0x${string}` =
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export const NATIVE_TOKEN_METADATA: TokenWithTradeInfo = {
  chainId: DEFAULT_CHAIN.id,
  address: NATIVE_TOKEN_ADDRESS,
  name: DEFAULT_CHAIN.nativeCurrency.name,
  decimals: DEFAULT_CHAIN.nativeCurrency.decimals,
  symbol: DEFAULT_CHAIN.nativeCurrency.symbol,
  logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
};

export const DEGEN_METADATA: TokenWithTradeInfo = {
  chainId: base.id,
  address: DEGEN_ADDRESS,
  name: "DEGEN",
  decimals: 18,
  symbol: "DEGEN",
  logoURI:
    "https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png",
};

export const DEFAULT_HEADER_HEIGHT = 64;
