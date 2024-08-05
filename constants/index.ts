//url path
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const DEGENCAST_WEB_HOST = process.env.EXPO_PUBLIC_DEGENCAST_WEB_HOST;
export const DEGENCAST_FRAME_HOST =
  process.env.EXPO_PUBLIC_DEGENCAST_FRAME_HOST;
// third account
export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || "";
// options
export const HTTP_HMAC_KEY = process.env.EXPO_PUBLIC_HTTP_HMAC_KEY || "";
export const INVITE_ONLY = process.env.EXPO_PUBLIC_INVITE_ONLY;
// styles
export const DEFAULT_HEADER_HEIGHT = 54;
export const DEFAULT_TABBAR_HEIGHT = 60;
export const PRIMARY_COLOR = "#4C2896";

export * from "./chain";
export * from "./att";
export * from "./0x";
export * from "./farcaster";
