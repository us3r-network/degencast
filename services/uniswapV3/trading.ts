import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { FeeAmount, SwapOptions, SwapRouter, Trade } from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { Address, decodeFunctionData } from "viem";
import {
  ATT_CONTRACT_CHAIN,
  UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
} from "~/constants";
import { getInputQuote } from "./quote";
import { getSwapRoute } from "./route";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";

export type TokenTrade = Trade<Token, Token, TradeType>;

// Trading Functions

export async function createTrade({
  tokenIn,
  tokenOut,
  amountOut,
  poolFee,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: bigint;
  poolFee?: FeeAmount;
}): Promise<TokenTrade> {
  const swapRoute = await getSwapRoute(
    tokenIn,
    tokenOut,
    poolFee || FeeAmount.MEDIUM,
  );

  const quoteData = await getInputQuote(swapRoute, tokenOut, amountOut);
  const amountIn = quoteData[0];
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

export async function getTradeCallData(
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
  console.log("methodParameters", methodParameters);
  const callDataDecoded = decodeFunctionData({
    abi: SwapRouterABI.abi,
    data: methodParameters.calldata as `0x${string}`,
  });

  return {
    calldata: {
      data: methodParameters.calldata,
      to: UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
      value: methodParameters.value,
      from: walletAddress,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    },
    decoded: {
      address: UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
      abi: SwapRouterABI.abi,
      chainId: ATT_CONTRACT_CHAIN.id,
      value: methodParameters.value,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
      ...callDataDecoded,
    },
  };
}
export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
