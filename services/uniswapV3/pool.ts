import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { Address, createPublicClient, getContract, http } from "viem";
import { UNISWAP_V3_POOL_CONTRACT_ADDRESS } from "~/constants";
import { getChain } from "~/utils/chain/getChain";

interface PoolInfo {
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: bigint;
  liquidity: bigint;
  tick: number;
}

export async function getPoolInfo({
  tokenIn,
  tokenOut,
  poolFee = FeeAmount.MEDIUM,
}: {
  tokenIn: Token;
  tokenOut: Token;
  poolFee?: FeeAmount;
}): Promise<PoolInfo> {
  if (!UNISWAP_V3_POOL_CONTRACT_ADDRESS) {
    throw new Error("UNISWAP_V3_POOL_CONTRACT_ADDRESS is not defined");
  }
  if (!tokenIn || !tokenOut) {
    throw new Error("Token is not defined");
  }
  if (!tokenIn.chainId || !tokenOut.chainId) {
    throw new Error("Token chainId is not defined");
  }
  if (!tokenIn.address || !tokenOut.address) {
    throw new Error("Token address is not defined");
  }
  console.log(
    "getPoolInfo",
    tokenIn,
    tokenOut,
    poolFee,
    UNISWAP_V3_POOL_CONTRACT_ADDRESS,
  );
  const publicClient = createPublicClient({
    chain: getChain(tokenIn.chainId),
    transport: http(),
  });

  const currentPoolAddress = computePoolAddress({
    factoryAddress: UNISWAP_V3_POOL_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: poolFee,
  });
  console.log("currentPoolAddress", currentPoolAddress);
  const poolContract = getContract({
    address: currentPoolAddress as Address,
    abi: IUniswapV3PoolABI.abi,
    client: publicClient,
  });

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.read.token0(),
      poolContract.read.token1(),
      poolContract.read.fee(),
      poolContract.read.tickSpacing(),
      poolContract.read.liquidity(),
      poolContract.read.slot0(),
    ]);
  console.log("poolInfo", {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    slot0,
  });
  return {
    token0: token0 as Address,
    token1: token1 as Address,
    fee: fee as number,
    tickSpacing: tickSpacing as number,
    liquidity: liquidity as bigint,
    sqrtPriceX96: (slot0 as any[])[0] as bigint,
    tick: (slot0 as any[])[1] as number,
  };
}
