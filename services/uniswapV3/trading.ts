import {
  CurrencyAmount,
  Percent,
  Token,
  TradeType
} from "@uniswap/sdk-core";
import {
  SwapOptions,
  SwapRouter,
  Trade
} from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { Address } from "viem";
import {
  UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS
} from "~/constants";
import { getInputQuote } from "./quote";
import { getSwapRoute } from "./route";


export type TokenTrade = Trade<Token, Token, TradeType>;

// Trading Functions

export async function createTrade({
  tokenIn,
  tokenOut,
  amountOut,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: bigint;
}): Promise<TokenTrade> {

  const swapRoute = await getSwapRoute(
    tokenIn,
    tokenOut,
  );

  const amountIn = await getInputQuote(swapRoute, tokenOut, amountOut);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      tokenIn,
      JSBI.BigInt(String(amountIn)),
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      tokenOut,
      JSBI.BigInt(String(amountOut)),
    ),
    tradeType: TradeType.EXACT_OUTPUT,
  });

  return uncheckedTrade;
}

export async function executeTrade(
  trade: TokenTrade,
  walletAddress: Address,
): Promise<any> {
  if (!walletAddress) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  return {
    data: methodParameters.calldata,
    to: UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
  };
}
