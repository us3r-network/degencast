// import { useSwitchChain } from "wagmi";
import { debounce, throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { base } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
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
import { NATIVE_TOKEN_METADATA } from "~/constants";
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
import { setBalance } from "viem/actions";

export default function TradeButton({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
}: {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
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
            (!token1 && !token2) ||
            token1.chainId !== base.id ||
            token2.chainId !== base.id
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
            token1={token1}
            token2={token2}
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
  const account = useAccount();
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const [fromToken, setFromToken] = useState(token1);
  const [toToken, setToToken] = useState(token2);
  const [fromAmount, setFromAmount] = useState(DEFAULT_AMOUNT);
  const [toAmount, setToAmount] = useState(DEFAULT_AMOUNT);

  const {
    fetchingPrice,
    swapingToken,
    fetchPrice,
    swapToken,
    transactionReceipt,
    transationStatus,
    transationLoading,
    isSuccess,
    error,
  } = useSwapToken(account.address);

  const fetchPriceInfo = async (amount: string) => {
    // console.log("fetchPriceInfo", fromToken, toToken, amount);
    const priceInfo = await fetchPrice({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    });
    console.log("fetchPriceInfo", priceInfo, fromToken, toToken, amount);
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
    if (chainId !== fromToken.chainId) return;
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

  const [fromTokenBalance, setFromTokenBalance] = useState(0);
  return (
    <View className="flex w-full gap-2">
      <Token
        token={fromToken}
        amount={fromAmount}
        setAmount={(amount) => setFromAmount(amount)}
        setBalance={(balance) => setFromTokenBalance(balance)}
      />
      <View className="flex-row items-center">
        <Separator className="flex-1 bg-secondary" />
        <Button
          disabled
          className="size-10 rounded-full border-2 border-secondary text-secondary"
          onPress={() => {
            console.log("swap", fromToken, toToken, token1, token2);
            if (fromToken.address === token1.address) {
              setFromToken(token2);
              setToToken(token1);
            } else {
              setFromToken(token1);
              setToToken(token2);
            }
            setFromAmount(DEFAULT_AMOUNT);
            setToAmount(DEFAULT_AMOUNT);
          }}
        >
          <ArrowUpDown />
        </Button>
        <Separator className="flex-1 bg-secondary" />
      </View>
      <Token token={toToken || NATIVE_TOKEN_METADATA} amount={toAmount} />
      {chainId === fromToken.chainId ? (
        <Button
          variant="secondary"
          className="mt-6"
          disabled={
            !fromTokenBalance ||
            fromTokenBalance < Number(fromAmount) ||
            fetchingPrice ||
            swapingToken ||
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
      ) : (
        <Button
          variant="secondary"
          className="mt-6"
          disabled={switchChainStatus === "pending"}
          onPress={async () => {
            await switchChain({ chainId: fromToken.chainId });
          }}
        >
          <Text>Switch to {base.name}</Text>
        </Button>
      )}
    </View>
  );
}

function Token({
  token,
  amount,
  setAmount,
  setBalance,
}: {
  token: TokenWithTradeInfo;
  amount?: string;
  setAmount?: (amount: string) => void;
  setBalance?: (balance: number) => void;
}) {
  const account = useAccount();
  // console.log("Token", token, amount);

  const tokenInfo = useUserToken(account.address, token.address, token.chainId);
  const nativeTokenInfo = useUserNativeToken(
    account.address,
    NATIVE_TOKEN_METADATA.chainId,
  );
  const balance = useMemo(() => {
    let b;
    if (token.address === NATIVE_TOKEN_METADATA.address) {
      b = nativeTokenInfo?.balance || "0";
    } else {
      b = tokenInfo?.balance || "0";
    }
    setBalance?.(Number(b));
    return b;
  }, [tokenInfo, nativeTokenInfo]);

  const price = Number(token.tradeInfo?.stats.token_price_usd) || 0;
  return (
    <View className="flex gap-2">
      <View className="flex-row items-center justify-between">
        <TokenInfo
          name={token.name}
          logo={token.logoURI}
          textClassName="text-2xl font-normal"
        />
        <Input
          editable={!!setAmount}
          className={cn(
            "max-w-40 rounded-full border-none bg-white/40 text-end text-3xl  text-white",
          )}
          inputMode="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xs font-medium text-secondary">Balance:</Text>
          <Text className="text-xs font-medium">
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 4,
              notation: "compact",
            }).format(Number(balance) || 0)}{" "}
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
