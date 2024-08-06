import { useEffect, useState } from "react";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useCallsStatus, useSendCalls } from "wagmi/experimental";
import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_X_CHAIN,
  ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
} from "~/constants";
import { getPrice, getQuote } from "~/services/trade/api/0x";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { encodeFunctionData } from "viem";
import useWalletAccount from "../user/useWalletAccount";

const DEFAULT_DECIMALS = 18;

type SwapParams = {
  sellToken: TokenWithTradeInfo;
  buyToken: TokenWithTradeInfo;
  sellAmount?: string;
  buyAmount?: string;
};

export function useFetchPrice(takerAddress?: `0x${string}`) {
  const [fetchingPrice, setFetchingPrice] = useState(false);

  const fetchPrice = async ({
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
  }: SwapParams) => {
    // console.log("fetchPrice", sellToken, buyToken, sellAmount, buyAmount);
    if (!sellToken || !buyToken) {
      console.log("no sellToken or buyToken");
      return;
    }
    if (
      !Number(sellAmount) &&
      !Number(buyAmount) &&
      !(Number(sellAmount) && Number(buyAmount))
    ) {
      console.log("no sellAmount or buyAmount");
      return;
    }
    // console.log("start fetch price from 0x");
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
    // console.log("price", price);
    setFetchingPrice(false);
    if (!price) return;
    return {
      buyAmount: formatUnits(
        price?.buyAmount,
        buyToken.decimals || DEFAULT_DECIMALS,
      ),
      price,
      allowanceTarget: price?.allowanceTarget,
    };
  };

  return {
    fetchingPrice,
    fetchPrice,
  };
}

export function useSwapToken(takerAddress?: `0x${string}`) {
  const {
    swaping: swapingEOA,
    fetchingQuote: fetchingQuoteEOA,
    waitingUserSign: waitingUserSignEOA,
    swapToken: swapTokenEOA,
    transactionReceipt: transactionReceiptEOA,
    transationLoading: transationLoadingEOA,
    isSuccess: isSuccessEOA,
    error: errorEOA,
    fee: feeEOA,
    reset: resetEOA,
  } = useSwapTokenEOA(takerAddress);

  const {
    swaping: swapingAA,
    fetchingQuote: fetchingQuoteAA,
    waitingUserSign: waitingUserSignAA,
    swapToken: swapTokenAA,
    transactionReceipt: transactionReceiptAA,
    transationLoading: transationLoadingAA,
    isSuccess: isSuccessAA,
    error: errorAA,
    fee: feeAA,
    reset: resetAA,
  } = useSwapTokenAA(takerAddress);

  const { supportAtomicBatch } = useWalletAccount();
  const isAA = supportAtomicBatch(ZERO_X_CHAIN.id);
  // const isAA = false;
  return {
    swaping: isAA ? swapingAA : swapingEOA,
    fetchingQuote: isAA ? fetchingQuoteAA : fetchingQuoteEOA,
    waitingUserSign: isAA ? waitingUserSignAA : waitingUserSignEOA,
    swapToken: isAA ? swapTokenAA : swapTokenEOA,
    transactionReceipt: isAA ? transactionReceiptAA : transactionReceiptEOA,
    transationLoading: isAA ? transationLoadingAA : transationLoadingEOA,
    isSuccess: isAA ? isSuccessAA : isSuccessEOA,
    error: isAA ? errorAA : errorEOA,
    fee: isAA ? feeAA : feeEOA,
    reset: isAA ? resetAA : resetEOA,
  };
}

export function useSwapTokenEOA(takerAddress?: `0x${string}`) {
  const [swaping, setSwaping] = useState(false);
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [waitingUserSign, setWaitingUserSign] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [fee, setFee] = useState(0);
  const {
    data: hash,
    sendTransactionAsync,
    error: sendTransactionError,
    reset: resetSendTransaction,
  } = useSendTransaction();
  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: transationLoading,
    isSuccess,
    status: transationStatus,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (transationStatus !== "pending") {
      setSwaping(false);
    }
  }, [transationStatus]);

  const swapToken = async ({
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
  }: SwapParams) => {
    if (!sellToken || !buyToken) {
      return;
    }
    if (
      !Number(sellAmount) &&
      !Number(buyAmount) &&
      !(Number(sellAmount) && Number(buyAmount))
    ) {
      return;
    }
    console.log("start fetch quote from 0x", takerAddress);
    setSwaping(true);
    try {
      setFetchingQuote(true);
      const quote = await getQuote({
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        sellAmount:
          sellAmount &&
          String(
            parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS),
          ),
        buyAmount:
          buyAmount &&
          String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
        takerAddress,
      });
      console.log("get quote from 0x", quote);
      const grossBuyAmount = Number(
        formatUnits(
          quote.grossBuyAmount,
          buyToken.decimals || DEFAULT_DECIMALS,
        ) || "0",
      );
      if (quote.fees?.zeroExFee?.feeAmount) {
        const zeroExFee = Number(
          formatUnits(
            quote.fees?.zeroExFee?.feeAmount,
            buyToken.decimals || DEFAULT_DECIMALS,
          ) || "0",
        );
        setFee(grossBuyAmount * ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE + zeroExFee);
        // console.log(
        //   "swap fee",
        //   grossBuyAmount * ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
        //   zeroExFee,
        // );
      }
      setFetchingQuote(false);
      setWaitingUserSign(true);
      await sendTransactionAsync({
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gas: quote.gas,
      });
      setWaitingUserSign(false);
    } catch (e) {
      console.error("swapToken error", e);
      setFetchingQuote(false);
      setWaitingUserSign(false);
      setSwaping(false);
      // setError(e as Error)
    }
  };

  const reset = () => {
    setSwaping(false);
    setFetchingQuote(false);
    setWaitingUserSign(false);
    resetSendTransaction();
  };
  return {
    fetchingQuote,
    waitingUserSign,
    swaping,
    swapToken,
    fee,
    transactionReceipt,
    transationStatus,
    transationLoading,
    isSuccess,
    error: error || sendTransactionError || transationError,
    reset,
  };
}

export function useSwapTokenAA(takerAddress?: `0x${string}`) {
  const [swaping, setSwaping] = useState(false);
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [waitingUserSign, setWaitingUserSign] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [fee, setFee] = useState(0);
  const {
    sendCallsAsync,
    data: id,
    isPending: sendCallsPending,
    error: sendCallsError,
    reset: resetSendCalls,
  } = useSendCalls();
  const {
    data: callsStatus,
    error: transationError,
    status: transationStatus,
    isLoading: transationLoading,
    isSuccess,
  } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      // Poll every second until the calls are confirmed
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  useEffect(() => {
    if (transationStatus !== "pending") {
      setSwaping(false);
    }
  }, [transationStatus]);

  const swapToken = async ({
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
  }: SwapParams) => {
    console.log(
      "swap with AA wallet",
      sellToken,
      buyToken,
      sellAmount,
      buyAmount,
    );
    if (!sellToken || !buyToken) {
      return;
    }
    if (
      !Number(sellAmount) &&
      !Number(buyAmount) &&
      !(Number(sellAmount) && Number(buyAmount))
    ) {
      return;
    }
    console.log("AA: start fetch quote from 0x", takerAddress);
    setSwaping(true);
    try {
      setFetchingQuote(true);
      const quote = await getQuote({
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        sellAmount:
          sellAmount &&
          String(
            parseUnits(sellAmount, sellToken.decimals || DEFAULT_DECIMALS),
          ),
        buyAmount:
          buyAmount &&
          String(parseUnits(buyAmount, buyToken.decimals || DEFAULT_DECIMALS)),
        takerAddress,
        skipValidation: true,
      });
      console.log("get quote from 0x", quote);
      const grossBuyAmount = Number(
        formatUnits(
          quote.grossBuyAmount,
          buyToken.decimals || DEFAULT_DECIMALS,
        ) || "0",
      );
      if (quote.fees?.zeroExFee?.feeAmount) {
        const zeroExFee = Number(
          formatUnits(
            quote.fees?.zeroExFee?.feeAmount,
            buyToken.decimals || DEFAULT_DECIMALS,
          ) || "0",
        );
        setFee(grossBuyAmount * ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE + zeroExFee);
        // console.log(
        //   "swap fee",
        //   grossBuyAmount * ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
        //   zeroExFee,
        // );
      }
      setFetchingQuote(false);
      setWaitingUserSign(true);

      const calls = [];
      console.log("buytoken", sellToken);
      if (sellToken.address !== NATIVE_TOKEN_ADDRESS) {
        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [quote.allowanceTarget, quote.value],
        });
        calls.push({
          to: sellToken.address,
          data: approveData,
        });
      }
      calls.push({
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gas: quote.gas,
      });
      console.log("calls", calls);
      await sendCallsAsync({ calls });
      console.log("sendCallsAsync done");
      setWaitingUserSign(false);
    } catch (e) {
      console.error("swapToken error", e);
      setFetchingQuote(false);
      setWaitingUserSign(false);
      setSwaping(false);
      // setError(e as Error)
    }
  };

  const transactionReceipt =
    callsStatus?.receipts && callsStatus.receipts.length > 0
      ? callsStatus?.receipts[callsStatus.receipts.length - 1]
      : undefined;

  const reset = () => {
    setSwaping(false);
    setFetchingQuote(false);
    setWaitingUserSign(false);
    resetSendCalls();
  };
  return {
    fetchingQuote,
    waitingUserSign,
    swaping,
    swapToken,
    fee,
    transactionReceipt,
    transationLoading,
    isSuccess,
    error: error || sendCallsError || transationError,
    reset,
  };
}
