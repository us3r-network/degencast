import { Token } from "@uniswap/sdk-core";
import { FeeAmount, Route } from "@uniswap/v3-sdk";
import { useEffect, useState } from "react";
import { UNISWAP_V3_QUOTER_CONTRACT_ADDRESS } from "~/constants";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { convertToken } from "~/services/uniswapV3";
import { getInputQuote, getOutputQuote } from "~/services/uniswapV3/quote";
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

  const tokenIn = sellToken ? convertToken(sellToken) : undefined;
  const tokenOut = buyToken ? convertToken(buyToken) : undefined;

  useEffect(() => {
    if (!tokenIn || !tokenOut) return;
    const getRoute = async () => {
      const swapRoute = await getSwapRoute(tokenIn, tokenOut, poolFee);
      setSwapRoute(swapRoute);
      setReady(true);
      console.log("swapRoute done", swapRoute);
    };
    if (tokenIn && tokenOut) {
      reset();
      if (tokenIn.address !== tokenOut.address) getRoute();
    }
  }, [tokenIn?.address, tokenOut?.address]);

  const [sellAmount, setSellAmount] = useState<bigint>();
  const [fetchingSellAmount, setFetchingSellAmount] = useState(false);

  const fetchSellAmount = (buyAmount: bigint) => {
    if (!swapRoute || !tokenOut || fetchingSellAmount) {
      return;
    }
    setFetchingSellAmount(true);
    console.log("fetchSellAmount", swapRoute, tokenOut, buyAmount);
    getInputQuote(swapRoute, tokenOut, buyAmount)
      .then((data) => {
        console.log("fetchSellAmount done", data);
        setSellAmount(data[0]);
      })
      .finally(() => {
        setFetchingSellAmount(false);
      });
  };

  const fetchSellAmountAsync = async (buyAmount: bigint) => {
    if (!swapRoute) {
      throw new Error("swapRoute not ready");
    }
    if (!tokenOut) {
      throw new Error("tokenOut not ready");
    }
    console.log("fetchSellAmount", swapRoute, tokenOut, buyAmount);
    const data = await getInputQuote(swapRoute, tokenOut, buyAmount);
    console.log("fetchSellAmountAsync done", data);
    return data[0];
  };

  const [buyAmount, setBuyAmount] = useState<bigint>();
  const [fetchingBuyAmount, setFetchingBuyAmount] = useState(false);

  const fetchBuyAmount = (sellAmount: bigint) => {
    if (!swapRoute || !tokenIn || fetchingBuyAmount) {
      return;
    }
    setFetchingBuyAmount(true);
    console.log("fetchBuyAmount", swapRoute, tokenIn, sellAmount);
    getOutputQuote(swapRoute, tokenIn, sellAmount)
      .then((data) => {
        console.log("fetchBuyAmount done", data);
        setBuyAmount(data[0]);
      })
      .finally(() => {
        setFetchingBuyAmount(false);
      });
  };
  const fetchBuyAmountAsync = async (sellAmount: bigint) => {
    if (!swapRoute) {
      throw new Error("swapRoute not ready");
    }
    if (!tokenIn) {
      throw new Error("tokenIn not ready");
    }
    console.log("fetchBuyAmount", swapRoute, tokenIn, sellAmount);
    const data = await getOutputQuote(swapRoute, tokenIn, sellAmount);
    console.log("fetchBuyAmountAsync done", data);
    return data[0];
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
    fetchSellAmountAsync,
    buyAmount,
    fetchingBuyAmount,
    fetchBuyAmount,
    fetchBuyAmountAsync,
  };
}
