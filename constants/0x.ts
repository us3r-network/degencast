import { DEFAULT_CHAIN } from "./chain";

export const ZERO_X_API_KEY = process.env.EXPO_PUBLIC_ZERO_X_API_KEY || "";
export const ZERO_X_CHAIN = DEFAULT_CHAIN;
export const ZERO_X_API_ENDPOINT = `https://${ZERO_X_CHAIN.name}.api.0x.org/swap/v1`;
export const ZERO_X_INTEGRATOR_WALLET_ADDRESS =
  process.env.EXPO_PUBLIC_ZERO_X_INTEGRATOR_WALLET_ADDRESS;
export const ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE = 0.0015;
