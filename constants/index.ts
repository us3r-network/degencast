//url path
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const DEGENCAST_WEB_HOST = process.env.EXPO_PUBLIC_DEGENCAST_WEB_HOST;
export const DEGENCAST_FRAME_HOST =
  process.env.EXPO_PUBLIC_DEGENCAST_FRAME_HOST;
export const PAYMASTER_AND_BUNDLER_ENDPOINT =
  process.env.EXPO_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT;
// third account
export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || "";
// options
export const HTTP_HMAC_KEY = process.env.EXPO_PUBLIC_HTTP_HMAC_KEY || "";
export const INVITE_ONLY = process.env.EXPO_PUBLIC_INVITE_ONLY;

export * from "./chain";
export * from "./att";
export * from "./0x";
export * from "./farcaster";
export * from "./styles";
