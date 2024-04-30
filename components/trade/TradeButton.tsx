// import { useSwitchChain } from "wagmi";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN_METADATA } from "~/constants";
import useSwapToken from "~/hooks/trade/useSwapToken";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import About from "../common/About";
import { ArrowUpDown } from "../common/Icons";
import { TokenInfo, TokenWithValue } from "../common/TokenInfo";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import ActiveWallet from "./ActiveWallet";
import {
  ErrorInfo,
  TransactionSuccessInfo,
  TransationData,
} from "./TranasactionResult";
import { debounce, throttle } from "lodash";

export default function TradeButton({
  fromToken = NATIVE_TOKEN_METADATA,
  toToken = NATIVE_TOKEN_METADATA,
}: {
  fromToken?: TokenWithTradeInfo;
  toToken?: TokenWithTradeInfo;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  return (
    <Dialog
      onOpenChange={() => {
        setTransationData(undefined);
        setError("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={cn("w-14")}
          size="sm"
          variant={"secondary"}
          disabled={
            (!fromToken && !toToken) ||
            fromToken.chainId !== base.id ||
            toToken.chainId !== base.id
          }
        >
          <Text>Trade</Text>
        </Button>
      </DialogTrigger>
      {!transationData && !error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Trade</DialogTitle>
            <ActiveWallet />
          </DialogHeader>
          <SwapToken
            token1={fromToken}
            token2={toToken}
            onSuccess={setTransationData}
            onError={setError}
          />
          <DialogFooter>
            <About title="Swap & Earn" info={TRADE_INFO} />
          </DialogFooter>
        </DialogContent>
      )}
      {transationData && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionSuccessInfo
            data={transationData}
            buttonText="Trade more"
            buttonAction={() => setTransationData(undefined)}
          />
        </DialogContent>
      )}
      {error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <ErrorInfo
            error={error}
            buttonText="Try Again"
            buttonAction={() => setError("")}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

const TRADE_INFO = [
  "For a one-time swap of token worth 30 USD, earn 500 points.",
];

const DEFAULT_AMOUNT = "0";
function SwapToken({
  token1,
  token2,
  onSuccess,
  onError,
}: {
  token1: TokenWithTradeInfo;
  token2: TokenWithTradeInfo;
  onSuccess?: (data: TransationData) => void;
  onError?: (error: string) => void;
}) {
  // console.log("Trade", fromChain, fromToken, toChain, toToken)
  const account = useAccount();
  const [fromToken, setFromToken] = useState(token1);
  const [toToken, setToToken] = useState(token2);
  const [fromAmount, setFromAmount] = useState(DEFAULT_AMOUNT);
  const [toAmount, setToAmount] = useState(DEFAULT_AMOUNT);

  const fromTokenInfo = useUserToken(
    account.address,
    fromToken.address,
    fromToken.chainId,
  );
  const toTokenInfo = useUserToken(
    account.address,
    toToken.address,
    toToken.chainId,
  );
  const nativeTokenInfo = useUserNativeToken(account.address, toToken.chainId);

  useEffect(() => {
    if (
      !fromTokenInfo ||
      !fromTokenInfo.balance ||
      !fromToken ||
      fromToken.address === NATIVE_TOKEN_METADATA.address
    )
      return;
    setFromToken({
      ...fromToken,
      balance: fromTokenInfo.balance,
      symbol: fromTokenInfo.symbol,
    });
  }, [fromTokenInfo]);

  useEffect(() => {
    if (
      !toTokenInfo ||
      !toTokenInfo.balance ||
      !toToken ||
      toToken.address === NATIVE_TOKEN_METADATA.address
    )
      return;

    setToToken({
      ...toToken,
      balance: toTokenInfo.balance,
      symbol: toTokenInfo.symbol,
    });
  }, [toTokenInfo]);

  useEffect(() => {
    if (!nativeTokenInfo || !nativeTokenInfo.balance) return;
    if (fromToken.address === NATIVE_TOKEN_METADATA.address)
      setFromToken({
        ...fromToken,
        balance: nativeTokenInfo.balance,
        symbol: nativeTokenInfo.symbol,
      });
    if (toToken.address === NATIVE_TOKEN_METADATA.address)
      setToToken({
        ...toToken,
        balance: nativeTokenInfo.balance,
        symbol: nativeTokenInfo.symbol,
      });
  }, [nativeTokenInfo]);

  const {
    fetchingPrice,
    fetchPrice,
    swapToken,
    transactionReceipt,
    transationStatus,
    transationLoading,
    isSuccess,
    error,
  } = useSwapToken(account.address);

  const fetchPriceInfo = async (amount: string) => {
    console.log("fetchPriceInfo", amount);
    const priceInfo = await fetchPrice({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    });
    if (!priceInfo) return;
    const { buyAmount } = priceInfo;
    setToAmount(buyAmount);
  };

  const debouncedFetchPriceInfo = useCallback(
    throttle(debounce(fetchPriceInfo, 500), 1000), // 0x api rate limit 1/second
    [],
  );

  const swap = async () => {
    // console.log("swap", fromAmount);
    swapToken({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: fromAmount,
    });
  };

  useEffect(() => {
    if (!fromAmount || fromAmount === DEFAULT_AMOUNT) {
      return;
    }
    setToAmount("");
    debouncedFetchPriceInfo(fromAmount);
  }, [fromAmount]);

  useEffect(() => {
    if (
      isSuccess &&
      transactionReceipt &&
      fromToken &&
      fromAmount &&
      toToken &&
      toAmount
    ) {
      const transationData = {
        transactionReceipt,
        description: (
          <View className="flex items-center gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-white">Swap</Text>
              <TokenWithValue token={fromToken} value={fromAmount} />
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-white">to</Text>
              <TokenWithValue token={toToken} value={toAmount} />
            </View>
          </View>
        ),
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      onError?.("Something Wrong!");
    }
  }, [error]);

  return (
    <View className="flex w-full gap-2">
      <Token
        token={fromToken}
        amount={fromAmount}
        setAmount={(amount) => setFromAmount(amount)}
      />
      <View className="flex-row items-center">
        <Separator className="flex-1 bg-secondary" />
        <Button
          className="size-10 rounded-full border-2 border-secondary text-secondary"
          onPress={() => {
            setFromToken(toToken);
            setToToken(fromToken);
            setFromAmount(DEFAULT_AMOUNT);
            setToAmount(DEFAULT_AMOUNT);
          }}
        >
          <ArrowUpDown />
        </Button>
        <Separator className="flex-1 bg-secondary" />
      </View>
      <Token token={toToken || NATIVE_TOKEN_METADATA} amount={toAmount} />
      <Button
        variant="secondary"
        className="mt-6"
        disabled={
          !fromToken?.balance ||
          Number(fromToken?.balance) < Number(fromAmount) ||
          fetchingPrice ||
          Number(fromAmount) === 0 ||
          Number(toAmount) === 0 ||
          transationLoading
        }
        onPress={() => {
          swap();
        }}
      >
        <Text>Swap</Text>
      </Button>
    </View>
  );
}

function Token({
  token,
  amount,
  setAmount,
}: {
  token: TokenWithTradeInfo;
  amount?: string;
  setAmount?: (amount: string) => void;
}) {
  // console.log("Token", token, amount);
  const price = Number(token.tradeInfo?.stats.token_price_usd) || 0;
  return (
    <View className="flex gap-2">
      <View className="flex-row items-start justify-between">
        <TokenInfo name={token.name} logo={token.logoURI} />
        <Input
          editable={!!setAmount}
          className={cn(
            "max-w-40 rounded-full border-none bg-white/40 text-end text-xl font-bold text-white",
          )}
          inputMode="numeric"
          defaultValue="0"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xs font-bold text-secondary">Balance:</Text>
          <Text className="text-xs">
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 4,
              notation: "compact",
            }).format(Number(token.balance) || 0)}{" "}
            {token?.symbol}
          </Text>
        </View>
        {amount && price > 0 && (
          <Text className="text-xs">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            }).format(Number(amount) * price)}
          </Text>
        )}
      </View>
    </View>
  );
}
