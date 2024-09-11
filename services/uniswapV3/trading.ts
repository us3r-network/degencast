import { Token, TradeType } from "@uniswap/sdk-core";
import SwapRouterABI from "@uniswap/swap-router-contracts/artifacts/contracts/SwapRouter02.sol/SwapRouter02.json";
import { FeeAmount, Trade } from "@uniswap/v3-sdk";
import { Address } from "viem";
import {
  ATT_CONTRACT_CHAIN,
  UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
} from "~/constants";
import { getInputQuote, getOutputQuote } from "./quote";
import { getSwapRoute } from "./route";
export type TokenTrade = Trade<Token, Token, TradeType>;

export async function getTradeCallData({
  tokenIn,
  tokenOut,
  amountOut,
  poolFee,
  walletAddress,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: bigint;
  poolFee?: FeeAmount;
  walletAddress: Address;
}): Promise<any> {
  if (!tokenIn || !tokenOut) {
    throw new Error("Token is not defined");
  }
  if (!tokenIn.chainId || !tokenOut.chainId) {
    throw new Error("Token chainId is not defined");
  }
  if (!tokenIn.address || !tokenOut.address) {
    throw new Error("Token address is not defined");
  }
  if (tokenIn.address === tokenOut.address) {
    throw new Error("Same Token!");
  }
  if (!amountOut) {
    throw new Error("No amount!");
  }
  const swapRoute = await getSwapRoute(
    tokenIn,
    tokenOut,
    poolFee || FeeAmount.MEDIUM,
  );

  const quoteData = await getInputQuote(swapRoute, tokenOut, amountOut);
  const amountIn = quoteData[0];

  const exactOutputSingleParams = {
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    fee: poolFee,
    recipient: walletAddress,
    amountOut,
    amountInMaximum: amountIn,
    sqrtPriceLimitX96: 0,
  };
  return {
    address: UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
    abi: SwapRouterABI.abi,
    chainId: ATT_CONTRACT_CHAIN.id,
    functionName: "exactOutputSingle",
    args: [exactOutputSingleParams],
  };
}

export async function getTradeCallDataWithInput({
  tokenIn,
  tokenOut,
  amountIn,
  poolFee,
  walletAddress,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: bigint;
  poolFee?: FeeAmount;
  walletAddress: Address;
}) {
  if (!tokenIn || !tokenOut) {
    throw new Error("Token is not defined");
  }
  if (!tokenIn.chainId || !tokenOut.chainId) {
    throw new Error("Token chainId is not defined");
  }
  if (!tokenIn.address || !tokenOut.address) {
    throw new Error("Token address is not defined");
  }
  if (tokenIn.address === tokenOut.address) {
    throw new Error("Same Token!");
  }
  if (!amountIn) {
    throw new Error("No amount!");
  }
  const swapRoute = await getSwapRoute(
    tokenIn,
    tokenOut,
    poolFee || FeeAmount.MEDIUM,
  );

  const quoteData = await getOutputQuote(swapRoute, tokenIn, amountIn);
  const amountOut = quoteData[0];

  const exactOutputSingleParams = {
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    fee: poolFee,
    recipient: walletAddress,
    amountIn,
    amountOutMinimum: amountOut,
    sqrtPriceLimitX96: 0,
  };
  return {
    address: UNISWAP_V3_SWAP_ROUTER_CONTRACT_ADDRESS,
    abi: SwapRouterABI.abi,
    chainId: ATT_CONTRACT_CHAIN.id,
    functionName: "exactInputSingle",
    args: [exactOutputSingleParams],
  };
}
