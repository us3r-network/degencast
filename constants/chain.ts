import { Address } from "viem";
import { base } from "viem/chains";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { getChain } from "~/utils/chain/getChain";

export const DEFAULT_CHAINID: number =
  Number(process.env.EXPO_PUBLIC_DEFAULT_CHAIN_ID) || base.id;
export const DEFAULT_CHAIN = getChain(DEFAULT_CHAINID);

export const NATIVE_TOKEN_ADDRESS:Address = process.env.EXPO_PUBLIC_NATIVE_TOKEN_ADDRESS as Address ||
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; //ETH
export const DEGEN_TOKEN_ADDRESS: Address = process.env.EXPO_PUBLIC_DEGEN_TOKEN_ADDRESS as Address ||
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export const NATIVE_TOKEN_METADATA: TokenWithTradeInfo = {
  chainId: DEFAULT_CHAINID,
  address: NATIVE_TOKEN_ADDRESS,
  name: DEFAULT_CHAIN.nativeCurrency.name,
  decimals: DEFAULT_CHAIN.nativeCurrency.decimals,
  symbol: DEFAULT_CHAIN.nativeCurrency.symbol,
  logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
};

export const DEGEN_TOKEN_METADATA: TokenWithTradeInfo = {
  chainId: DEFAULT_CHAINID,
  address: DEGEN_TOKEN_ADDRESS,
  name: "DEGEN",
  decimals: 18,
  symbol: "DEGEN",
  logoURI:
    "https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png",
};
