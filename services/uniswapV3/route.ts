import {
    Token
} from "@uniswap/sdk-core";
import {
    FeeAmount,
    Pool,
    Route
} from "@uniswap/v3-sdk";
import { getPoolInfo } from "./pool";
  
export async function getSwapRoute(
    tokenIn: Token,
    tokenOut: Token,
    poolFee: number = FeeAmount.MEDIUM,
  ): Promise<Route<Token, Token>> {
    const poolInfo = await getPoolInfo({
      tokenIn,
      tokenOut,
      poolFee,
    });
  
    const pool = new Pool(
      tokenIn,
      tokenOut,
      poolInfo.fee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick,
    );
    console.log("pool", pool);
    return new Route(
      [pool],
      tokenIn,
      tokenOut,
    );
  }