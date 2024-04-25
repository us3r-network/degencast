import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatUnits, parseUnits } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import {
  fetchItems,
  selectCommunityTokens,
} from "~/features/trade/communityTokensSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { getPrice, getQuote } from "~/services/trade/api/0x";
import { TokenInfoWithMetadata } from "~/services/user/types";

const DEFAULT_DECIMALS = 18;

type SwapParams = {
  sellToken: TokenInfoWithMetadata;
  buyToken: TokenInfoWithMetadata;
  sellAmount?: string;
  buyAmount?: string;
};

export default function useSwapToken(takerAddress?: `0x${string}`) {
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
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
      sellToken: sellToken.contractAddress,
      buyToken: buyToken.contractAddress,
      sellAmount:
        sellAmount &&
        String(parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS)),
      buyAmount:
        buyAmount &&
        String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
      takerAddress,
    });
    console.log("quote", price);
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
    const quote = await getQuote({
      sellToken: sellToken.contractAddress,
      buyToken: buyToken.contractAddress,
      sellAmount:
        sellAmount &&
        String(parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS)),
      buyAmount:
        buyAmount &&
        String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
      takerAddress,
    });
    console.log("quote", quote);
    sendTransaction({ to: quote.to, data: quote.data });
    setFetchingPrice(false);
  };

  return {
    fetchingPrice,
    fetchPrice,
    swapToken,
    hash,
    isConfirming,
    isConfirmed,
  };
}
