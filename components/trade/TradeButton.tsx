// import { useSwitchChain } from "wagmi";
import { useConnectWallet } from "@privy-io/react-auth";
import { debounce, defaultTo, throttle } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
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
import useUserAction from "~/hooks/user/useUserAction";
import {
  TOKENS,
  useUserNativeToken,
  useUserToken,
} from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { UserActionName } from "~/services/user/types";
import About from "../common/About";
import { ArrowUpDown, User } from "../common/Icons";
import { TokenInfo, TokenWithValue } from "../common/TokenInfo";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import ActiveWallet from "./ActiveWallet";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import UserTokenSelect from "./UserTokenSelect";
import CommunityToeknSelect from "./CommunityTokenSelect";
import { Loading } from "../common/Loading";

export default function TradeButton({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
}: {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
}) {
  const [swaping, setSwaping] = useState(false);
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={connectWallet}
      >
        <Text>Trade</Text>
      </Button>
    );
  else
    return (
      <Dialog
        onOpenChange={() => {
          setSwaping(false);
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
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>{!swaping ? "Trade" : "Transaction"}</DialogTitle>
            {!swaping && <ActiveWallet />}
          </DialogHeader>
          <SwapToken token1={token1} token2={token2} setSwaping={setSwaping} />
          {!swaping && (
            <DialogFooter>
              <About title="Swap & Earn" info={TRADE_INFO} />
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
}

const TRADE_INFO = [
  "For a one-time swap of token worth 30 USD, earn 500 points.",
  "0.3% swap fee",
];

const DEFAULT_AMOUNT = "0";
function SwapToken({
  token1,
  token2,
  setSwaping,
}: {
  token1: TokenWithTradeInfo;
  token2: TokenWithTradeInfo;
  setSwaping?: (swaping: boolean) => void;
}) {
  const account = useAccount();
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const [fromTokenSet, setFromTokenSet] = useState<TokenSetInfo>();
  const [toTokenSet, setToTokenSet] = useState<TokenSetInfo>();
  const [fromToken, setFromToken] = useState<TokenWithTradeInfo>();
  const [toToken, setToToken] = useState<TokenWithTradeInfo>();
  const [fromAmount, setFromAmount] = useState(DEFAULT_AMOUNT);
  const [toAmount, setToAmount] = useState(DEFAULT_AMOUNT);
  const [transationData, setTransationData] = useState<TransationData>();
  const [transationError, setTransationError] = useState<string>();
  useEffect(() => {
    if (!token1 || token1 === NATIVE_TOKEN_METADATA)
      setFromTokenSet({
        type: TokenType.USER_TOKENS,
      });
    else
      setFromTokenSet({
        type: TokenType.COMMUNITY_TOKENS,
        defaultToken: token1,
      });
  }, [token1]);

  useEffect(() => {
    if (!token2 || token2 === NATIVE_TOKEN_METADATA)
      setToTokenSet({
        type: TokenType.USER_TOKENS,
      });
    else
      setToTokenSet({
        type: TokenType.COMMUNITY_TOKENS,
        defaultToken: token2,
      });
  }, [token2]);

  const {
    swaping,
    fetchingPrice,
    fetchingQuote,
    waitingUserSign,
    fetchPrice,
    swapToken,
    transactionReceipt,
    transationStatus,
    transationLoading,
    isSuccess,
    error,
    reset,
  } = useSwapToken(account.address);

  const { submitUserAction } = useUserAction();

  const fetchPriceInfo = async (amount: string) => {
    // console.log("fetchPriceInfo", fromToken, toToken, amount);
    if (!fromToken || !toToken || !amount) return;
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
    [fetchPriceInfo],
  );
  const swap = async () => {
    // console.log("swap", fromAmount);
    if (!fromToken || !toToken || !fromAmount) return;
    if (chainId !== fromToken.chainId) return;
    swapToken({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: fromAmount,
    });
  };
  useEffect(() => {
    setFromAmount(DEFAULT_AMOUNT);
    setToAmount(DEFAULT_AMOUNT);
  }, [fromToken, toToken]);

  useEffect(() => {
    setToAmount("");
    if (!fromAmount || fromAmount === DEFAULT_AMOUNT) {
      return;
    }
    debouncedFetchPriceInfo(fromAmount);
  }, [fromAmount]);

  useEffect(() => {
    if (
      fromToken &&
      fromAmount &&
      toToken &&
      toAmount &&
      (waitingUserSign ||
        transationLoading ||
        (isSuccess && transactionReceipt))
    ) {
      const transationData = {
        chain: base,
        transactionReceipt,
        description: (
          <View className="flex w-full items-center gap-2">
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">From</Text>
              <TokenWithValue token={fromToken} value={fromAmount} />
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">To</Text>
              <TokenWithValue token={toToken} value={toAmount} />
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">$SPELL</Text>
              <Text className="font-medium text-white">+1000</Text>
            </View>
          </View>
        ),
      };
      setTransationData(transationData);
      setSwaping?.(swaping);
    }
  }, [isSuccess, waitingUserSign, transactionReceipt, transationLoading]);

  useEffect(() => {
    //todo: add condition of more than $30
    console.log("isSuccess", isSuccess, transactionReceipt);
    if (isSuccess)
      submitUserAction({
        action: UserActionName.SwapToken,
      });
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      setTransationData(undefined);
      setTransationError((error as any)?.details || "Transaction failed!");
    }
  }, [error]);

  const tryAgain = () => {
    setTransationData(undefined);
    setTransationError(undefined);
    setSwaping?.(false);
    reset();
  };

  const [fromTokenBalance, setFromTokenBalance] = useState(0);

  const switchToken = () => {
    const temp = fromTokenSet;
    setFromTokenSet(toTokenSet);
    setToTokenSet(temp);
    setFromAmount(DEFAULT_AMOUNT);
    setToAmount(DEFAULT_AMOUNT);
  };

  if (transationData)
    return (
      <TransactionInfo
        data={transationData}
        buttonText="Trade more"
        buttonAction={tryAgain}
      />
    );
  else if (transationError)
    return (
      <ErrorInfo
        error={transationError}
        buttonText="Try Again"
        buttonAction={tryAgain}
      />
    );
  else
    return (
      <View className="z-50 flex w-full gap-2">
        {fromTokenSet && (
          <View className="z-[100]">
            <TokenWithAmount
              tokenSet={fromTokenSet}
              amount={fromAmount}
              changeToken={setFromToken}
              setAmount={(amount) => setFromAmount(amount)}
              setBalance={(balance) => setFromTokenBalance(balance)}
            />
          </View>
        )}
        <View className="flex-row items-center">
          <Separator className="flex-1 bg-secondary" />
          <Button disabled
            className="size-10 rounded-full border-2 border-secondary text-secondary"
            onPress={switchToken}
          >
            <ArrowUpDown />
          </Button>
          <Separator className="flex-1 bg-secondary" />
        </View>
        {toTokenSet && (
          <View className="z-50">
            <TokenWithAmount
              tokenSet={toTokenSet}
              changeToken={setToToken}
              amount={toAmount}
            />
          </View>
        )}
        {fromToken &&
          toToken &&
          (chainId === fromToken.chainId ? (
            <Button
              variant="secondary"
              className="mt-6"
              disabled={
                !fromTokenBalance ||
                fromTokenBalance < Number(fromAmount) ||
                fetchingPrice ||
                fetchingQuote ||
                fetchingQuote ||
                Number(fromAmount) === 0 ||
                Number(toAmount) === 0 ||
                transationLoading
              }
              onPress={() => {
                swap();
              }}
            >
              {fetchingPrice ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color={"white"} />
                  <Text>Fetching Price...</Text>
                </View>
              ) : fetchingQuote ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color={"white"} />
                  <Text>Fetching Quote...</Text>
                </View>
              ) : waitingUserSign ? (
                <Text>Please sign the transaction!</Text>
              ) : transationLoading ? (
                <Text>Comfirming the transaction...</Text>
              ) : (
                <Text>Swap</Text>
              )}
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
          ))}
      </View>
    );
}

type TokenSetInfo = {
  type: TokenType;
  defaultToken?: TokenWithTradeInfo;
};

enum TokenType {
  USER_TOKENS = "USER_TOKENS",
  COMMUNITY_TOKENS = "COMMUNITY_TOKENS",
}

function TokenWithAmount({
  tokenSet,
  amount,
  changeToken,
  setAmount,
  setBalance,
}: {
  tokenSet: TokenSetInfo;
  amount?: string;
  changeToken?: (token: TokenWithTradeInfo) => void;
  setAmount?: (amount: string) => void;
  setBalance?: (balance: number) => void;
}) {
  const account = useAccount();
  // console.log("Token", token, amount);
  const [token, setToken] = useState(
    tokenSet.defaultToken || NATIVE_TOKEN_METADATA,
  );

  useEffect(() => {
    if (token) {
      changeToken?.(token);
      setAmount?.(DEFAULT_AMOUNT);
    }
  }, [token]);

  const tokenInfo = useUserToken(
    account.address,
    token?.address,
    token?.chainId,
  );

  const nativeTokenInfo = useUserNativeToken(
    account.address,
    NATIVE_TOKEN_METADATA.chainId,
    !token || token?.chainId !== NATIVE_TOKEN_METADATA.chainId,
  );

  const balance = useMemo(() => {
    let b: string | number = 0;
    if (token)
      if (token.address === NATIVE_TOKEN_METADATA.address) {
        b = nativeTokenInfo?.balance || "0";
      } else {
        b = tokenInfo?.balance || "0";
      }
    setBalance?.(Number(b));
    return b;
  }, [tokenInfo, nativeTokenInfo]);

  const price = Number(token?.tradeInfo?.stats.token_price_usd) || 0;

  return (
    <View className="z-50 flex gap-2">
      <View className="z-50 flex-row items-center justify-between">
        {tokenSet.type === TokenType.USER_TOKENS ? (
          <UserTokenSelect
            selectToken={setToken}
            showBalance={false}
            supportTokenKeys={[TOKENS.NATIVE]}
          />
        ) : tokenSet.type === TokenType.COMMUNITY_TOKENS ? (
          <CommunityToeknSelect
            defaultToken={tokenSet.defaultToken}
            selectToken={setToken}
          />
        ) : (
          <Loading />
        )}
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
