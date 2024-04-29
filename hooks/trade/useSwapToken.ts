import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { getPrice, getQuote } from "~/services/trade/api/0x";
import { TokenWithTradeInfo } from "~/services/trade/types";

const DEFAULT_DECIMALS = 18;

type SwapParams = {
  sellToken: TokenWithTradeInfo;
  buyToken: TokenWithTradeInfo;
  sellAmount?: string;
  buyAmount?: string;
};

export default function useSwapToken(takerAddress?: `0x${string}`) {
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [error, setError] = useState<Error | null>();
  const {
    data: hash,
    sendTransaction,
    error: sendTransactionError,
  } = useSendTransaction();
  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: transationLoading,
    isSuccess,
    status:transationStatus,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const fetchPrice = async ({
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
  }: SwapParams) => {
    console.log("fetchPrice", sellToken, buyToken, sellAmount, buyAmount);
    if (!sellToken || !buyToken) {
      console.log("no sellToken or buyToken");
      return;
    }
    if (!sellAmount && !buyAmount && !(sellAmount && buyAmount)) {
      console.log("no sellAmount or buyAmount");
      return;
    }
    console.log("start fetch price from 0x");
    setFetchingPrice(true);
    const price = await getPrice({
      sellToken: sellToken.address,
      buyToken: buyToken.address,
      sellAmount:
        sellAmount &&
        String(parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS)),
      buyAmount:
        buyAmount &&
        String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
      takerAddress,
    });
    console.log("price", price);
    setFetchingPrice(false);
    if (!price) return;
    return {
      buyAmount: formatUnits(
        price?.buyAmount,
        buyToken.decimals || DEFAULT_DECIMALS,
      ),
      price,
    };
  };

  const swapToken = async ({
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
  }: SwapParams) => {
    if (!sellToken || !buyToken) {
      return;
    }
    if (!sellAmount && !buyAmount && !(sellAmount && buyAmount)) {
      return;
    }
    console.log("start fetch quote from 0x");
    setFetchingPrice(true);
    try {
      const quote = await getQuote({
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        sellAmount:
          sellAmount &&
          String(parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS)),
        buyAmount:
          buyAmount &&
          String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
        takerAddress,
      });
      console.log("quote", quote);
      sendTransaction({ to: quote.to, data: quote.data, value: quote.value});
    } catch (e) {
      console.error("swapToken error", e);
      // setError(e as Error)
    }
    setFetchingPrice(false);
  };

  return {
    fetchingPrice,
    fetchPrice,
    swapToken,
    transactionReceipt,
    transationStatus,
    transationLoading,
    isSuccess,
    error: error || sendTransactionError || transationError,
  };
}
