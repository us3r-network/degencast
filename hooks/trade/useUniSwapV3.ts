import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useReadContract } from "wagmi";
import {
  UNISWAP_V3_QUOTER_CONTRACT_ADDRESS
} from "~/constants";
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
      address: UNISWAP_V3_QUOTER_CONTRACT_ADDRESS,
      abi: Quoter.abi,
      chainId: buyToken.chainId,
    };
    // console.log("fetchInputAmount", buyAmount, tokenA, tokenB);
    const { data, error } = useReadContract({
      ...quoterContract,
      functionName: "quoteExactOutputSingle",
      args: [
        sellToken.address,
        buyToken.address,
        FeeAmount.MEDIUM,
        buyAmount,
        0,
      ],
    } as any);
    // console.log("fetchOutputAmount", data, error);
    return { sellAmount: data as bigint, error };
  };

  return {
    fetchSellAmount,
  };
}
