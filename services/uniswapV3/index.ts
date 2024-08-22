import { Token } from "@uniswap/sdk-core";
import { TokenWithTradeInfo } from "../trade/types";

export function convertToken(token: TokenWithTradeInfo) {
  return new Token(
    token.chainId,
    token.address,
    token.decimals || 18,
    token.symbol,
    token.name,
  );
}
