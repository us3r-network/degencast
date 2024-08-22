import QuoterV2 from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useReadContract } from "wagmi";
import { UNISWAP_V3_QUOTERV2_CONTRACT_ADDRESS } from "~/constants";
import { TokenWithTradeInfo } from "~/services/trade/types";

type QuoteParams = {
  sellToken: TokenWithTradeInfo;
  buyToken: TokenWithTradeInfo;
  sellAmount?: bigint;
  buyAmount?: bigint;
};

export function useQuote({ sellToken, buyToken }: QuoteParams) {
  const fetchSellAmount = (buyAmount: bigint) => {
    const quoterContract = {
      address: UNISWAP_V3_QUOTERV2_CONTRACT_ADDRESS,
      abi: QuoterV2.abi,
      chainId: buyToken.chainId,
    };
    // console.log("fetchInputAmount", buyAmount, sellToken, buyToken);
    const { data, error } = useReadContract({
      ...quoterContract,
      functionName: "quoteExactOutputSingle",
      args: [
        {
          tokenIn: sellToken.address,
          tokenOut: buyToken.address,
          amount: buyAmount,
          fee: FeeAmount.MEDIUM,
          sqrtPriceLimitX96: 0,
        },
      ],
    } as any);
    // console.log("fetchOutputAmount", data, error);
    return { sellAmount: data?(data as any[])[0] as bigint:0n, error };
  };

  return {
    fetchSellAmount,
  };
}
