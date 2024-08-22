import { Token } from "@uniswap/sdk-core";
import { TokenWithTradeInfo } from "../trade/types";
import { NATIVE_TOKEN_ADDRESS, WRAP_NATIVE_TOKEN_ADDRESS } from "~/constants";

export function convertToken(token: TokenWithTradeInfo) {
  return new Token(
    token.chainId,
    token.address!==NATIVE_TOKEN_ADDRESS ? token.address : WRAP_NATIVE_TOKEN_ADDRESS,
    token.decimals || 18,
    token.symbol,
    token.name,
  );
}
