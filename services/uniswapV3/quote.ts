import { Currency, CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import QuoterV2ABI from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import { Route, SwapQuoter } from "@uniswap/v3-sdk";
import {
  Address,
  createPublicClient,
  decodeAbiParameters,
  decodeFunctionData,
  http
} from "viem";
import { UNISWAP_V3_QUOTER_CONTRACT_ADDRESS } from "~/constants";
import { getChain } from "~/utils/chain/getChain";

// Helper Quoting and Pool Functions

export async function getInputQuote(
  route: Route<Currency, Currency>,
  tokenOut: Token,
  amountOut: bigint,
) {
  if (!UNISWAP_V3_QUOTER_CONTRACT_ADDRESS) {
    throw new Error("UNISWAP_V3_QUOTERV2_CONTRACT_ADDRESS is not defined");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(tokenOut, amountOut.toString()),
    TradeType.EXACT_OUTPUT,
    {
      useQuoterV2: true,
    },
  );

  const callDataDecoded = decodeFunctionData({
    abi: QuoterV2ABI.abi,
    data: calldata as `0x${string}`,
  });
  console.log("callDataDecoded", callDataDecoded);
  const publicClient = createPublicClient({
    chain: getChain(route.chainId),
    transport: http(),
  });
  const quoteCallReturnData = await publicClient.call({
    to: UNISWAP_V3_QUOTER_CONTRACT_ADDRESS as Address,
    data: calldata as `0x${string}`,
  });

  const outputAbi = QuoterV2ABI.abi.find((abi) => {
    return abi.name === callDataDecoded.functionName;
  }
  );
  console.log("quoteCallReturnData", quoteCallReturnData, outputAbi);
  const data = decodeAbiParameters(
    outputAbi?.outputs as any,
    quoteCallReturnData.data!,
  );
  return data;
}
