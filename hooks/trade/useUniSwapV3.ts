import { Token } from "@uniswap/sdk-core";
import { FeeAmount, Route } from "@uniswap/v3-sdk";
import { useEffect, useState } from "react";
import { UNISWAP_V3_QUOTER_CONTRACT_ADDRESS } from "~/constants";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { convertToken } from "~/services/uniswapV3";
import { getInputQuote } from "~/services/uniswapV3/quote";
import { getSwapRoute } from "~/services/uniswapV3/route";

type QuoteParams = {
  sellToken: TokenWithTradeInfo;
  buyToken: TokenWithTradeInfo;
  sellAmount?: bigint;
  buyAmount?: bigint;
  poolFee?: FeeAmount;
};

export function useSwap({
  sellToken,
  buyToken,
  poolFee = FeeAmount.MEDIUM,
}: QuoteParams) {
  const [swapRoute, setSwapRoute] = useState<Route<Token, Token>>();
  const [ready, setReady] = useState(false);

  const tokenIn = convertToken(sellToken);
  const tokenOut = convertToken(buyToken);

  useEffect(() => {
    const getRoute = async () => {
      const swapRoute = await getSwapRoute(tokenIn, tokenOut, poolFee);
      setSwapRoute(swapRoute);
      setReady(true);
      // console.log("swapRoute done", swapRoute);
    };
    if (tokenIn && tokenOut) {
      reset();
      if (tokenIn.address !== tokenOut.address) getRoute();
    }
  }, [tokenIn.address, tokenOut.address]);

  const [sellAmount, setSellAmount] = useState<bigint>();
  const [fetchingSellAmount, setFetchingSellAmount] = useState(false);

  const fetchSellAmount = (buyAmount: bigint) => {
    if (!swapRoute || fetchingSellAmount) {
      return;
    }
    setFetchingSellAmount(true);
    getInputQuote(swapRoute, tokenOut, buyAmount)
      .then((data) => {
        // console.log("fetchSellAmount", data);
        setSellAmount(data[0]);
      })
      .finally(() => {
        setFetchingSellAmount(false);
      });
  };

  const reset = () => {
    setSellAmount(undefined);
    setSwapRoute(undefined);
    setReady(false);
  };

  return {
    ready,
    sellAmount,
    fetchingSellAmount,
    fetchSellAmount,
  };
}
