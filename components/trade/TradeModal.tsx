import { UnknownAction } from "@reduxjs/toolkit";
import { debounce, throttle } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import { Address, parseUnits } from "viem";
import { useAccount, useChainId } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import {
  DEFAULT_CHAIN,
  DEFAULT_CHAINID,
  DEGEN_TOKEN_METADATA,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import { fetchItems as fetchUserCommunityNFTs } from "~/features/user/communityNFTsSlice";
import { fetchItems as fetchUserCommunityTokens } from "~/features/user/communityTokensSlice";
import { useFetchPrice, useSwapToken } from "~/hooks/trade/use0xSwap";
import useAppModals from "~/hooks/useAppModals";
import useUserAction from "~/hooks/user/useUserAction";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { UserActionName } from "~/services/user/types";
import { eventBus, EventTypes } from "~/utils/eventBus";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { ArrowUpDown } from "../common/Icons";
import { Loading } from "../common/Loading";
import { TokenWithValue } from "../common/TokenInfo";
import UserWalletSelect from "../portfolio/tokens/UserWalletSelect";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import CommunityTokenSelect from "./CommunityTokenSelect";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import { ERC20TokenBalance, NativeTokenBalance } from "./TokenBalance";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import UserTokenSelect from "./UserTokenSelect";

export default function TradeModal({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
  triggerButton,
  onOpenBefore,
}: {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
  triggerButton: React.ReactNode;
  onOpenBefore?: () => void;
}) {
  const [swaping, setSwaping] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && onOpenBefore) onOpenBefore();
        setOpen(open);
        setSwaping(false);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader
          className={cn("mr-4 flex-row items-center justify-between gap-2")}
        >
          <DialogTitle>{!swaping ? "Trade" : "Transaction"}</DialogTitle>
        </DialogHeader>
        {!swaping && (
          <View className="flex-row items-center justify-between gap-2">
            <Text>Active Wallet</Text>
            <UserWalletSelect />
          </View>
        )}
        <SwapToken
          token1={token1}
          token2={token2}
          setSwaping={setSwaping}
          setClose={() => setOpen(false)}
        />
        {/* {!swaping && (
          <DialogFooter>
            <About title="Swap & Earn" info={TRADE_INFO} />
          </DialogFooter>
        )} */}
      </DialogContent>
    </Dialog>
  );
}

export function TradeTokenGlobalModal() {
  const [swaping, setSwaping] = useState(false);
  const { tradeTokenModal, setTradeTokenModal } = useAppModals();
  const { open } = tradeTokenModal;
  const token1 = tradeTokenModal.token1 || NATIVE_TOKEN_METADATA;
  const token2 = tradeTokenModal.token2 || NATIVE_TOKEN_METADATA;
  return (
    <Dialog
      onOpenChange={(open) => {
        setSwaping(false);
        setTradeTokenModal({ open, token1, token2 });
      }}
      open={open}
    >
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader
          className={cn("mr-4 flex-row items-center justify-between gap-2")}
        >
          <DialogTitle>{!swaping ? "Trade" : "Transaction"}</DialogTitle>
        </DialogHeader>
        {!swaping && (
          <View className="flex-row items-center justify-between gap-2">
            <Text>Active Wallet</Text>
            <UserWalletSelect />
          </View>
        )}
        <SwapToken
          token1={token1}
          token2={token2}
          setSwaping={setSwaping}
          setClose={() => {
            setTradeTokenModal({
              open: false,
              token1: NATIVE_TOKEN_METADATA,
              token2: NATIVE_TOKEN_METADATA,
            });
          }}
        />
        {/* {!swaping && (
          <DialogFooter>
            <About title="Swap & Earn" info={TRADE_INFO} />
          </DialogFooter>
        )} */}
      </DialogContent>
    </Dialog>
  );
}

const TRADE_INFO = [
  "For a one-time swap of token worth 30 USD, earn 500 $CAST.",
  "0.3% swap fee",
];

const DEFAULT_AMOUNT = "0";
function SwapToken({
  token1,
  token2,
  setSwaping,
  setClose,
}: {
  token1: TokenWithTradeInfo;
  token2: TokenWithTradeInfo;
  setSwaping?: (swaping: boolean) => void;
  setClose?: () => void;
}) {
  const dispatch = useDispatch();
  const account = useAccount();
  const chainId = useChainId();
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

  const { fetchingPrice, fetchPrice } = useFetchPrice(account.address);

  const {
    swaping,
    fetchingQuote,
    waitingUserSign,
    swapToken,
    transactionReceipt,
    transationLoading,
    isSuccess,
    error,
    fee,
    reset,
  } = useSwapToken(account.address);

  const { submitUserAction } = useUserAction();
  const [allowanceTarget, setAllowanceTarget] = useState<Address>();
  const fetchPriceInfo = async (amount: string) => {
    // console.log("fetchPriceInfo", fromToken, toToken, amount);
    if (!fromToken || !toToken || !amount) return;
    const priceInfo = await fetchPrice({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    });
    if (!priceInfo) return;
    const { buyAmount, allowanceTarget } = priceInfo;
    setToAmount(buyAmount);
    setAllowanceTarget(allowanceTarget);
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
        chain: DEFAULT_CHAIN,
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
              <Text className="font-medium text-secondary">Fee</Text>
              <TokenWithValue token={toToken} value={fee} />
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">$CAST</Text>
              <Text className="font-medium text-white">+1000</Text>
            </View>
          </View>
        ),
      };
      setTransationData(transationData);
      setSwaping?.(swaping);
      setTimeout(() => {
        if (isSuccess && account?.address) {
          dispatch(
            fetchUserCommunityNFTs(account.address) as unknown as UnknownAction,
          );
          dispatch(
            fetchUserCommunityTokens(
              account.address,
            ) as unknown as UnknownAction,
          );
        }
      }, 5000);
    }
  }, [isSuccess, waitingUserSign, transactionReceipt, transationLoading]);

  useEffect(() => {
    const usdAmount =
      Number(fromAmount) *
        Number(fromToken?.tradeInfo?.stats?.token_price_usd) ||
      Number(toAmount) * Number(toToken?.tradeInfo?.stats?.token_price_usd);
    const enoughAmount = usdAmount > 30;
    if (isSuccess && enoughAmount && transactionReceipt?.transactionHash)
      submitUserAction({
        action: UserActionName.SwapToken,
        data: { hash: transactionReceipt?.transactionHash },
      });
    if (isSuccess) {
      if (
        fromToken?.address === NATIVE_TOKEN_METADATA.address ||
        toToken?.address === NATIVE_TOKEN_METADATA.address
      )
        eventBus.next({ type: EventTypes.NATIVE_TOKEN_BALANCE_CHANGE });
      if (
        fromToken?.address !== DEGEN_TOKEN_METADATA.address ||
        toToken?.address !== DEGEN_TOKEN_METADATA.address
      )
        eventBus.next({ type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE });
    }
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
    if (!fromTokenSet || !toTokenSet || !fromToken || !toToken) return;
    console.log("switchToken", fromToken, toToken);
    setFromTokenSet({
      type: toTokenSet.type,
      defaultToken: toToken,
    });
    setToTokenSet({
      type: fromTokenSet.type,
      defaultToken: fromToken,
    });
  };

  const allowanceParams =
    account?.address &&
    fromToken?.address &&
    fromToken?.decimals &&
    fromAmount &&
    allowanceTarget
      ? {
          owner: account.address,
          tokenAddress: fromToken.address,
          spender: allowanceTarget,
          value: parseUnits(fromAmount, fromToken.decimals),
        }
      : undefined;
  if (transationData)
    return (
      <TransactionInfo
        type={ONCHAIN_ACTION_TYPE.SWAP_TOKEN}
        data={transationData}
        buttonText="Trade more"
        buttonAction={tryAgain}
        navigateToCreatePageAfter={setClose}
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
      <View className="flex w-full gap-2">
        {fromTokenSet && (
          <TokenWithAmount
            tokenSet={fromTokenSet}
            amount={fromAmount}
            changeToken={setFromToken}
            setAmount={(amount) => setFromAmount(amount)}
            setBalance={(balance) => setFromTokenBalance(balance)}
          />
        )}
        <View className="flex-row items-center">
          <Separator className="flex-1 bg-secondary" />
          <Button
            className="size-10 rounded-full border-2 border-secondary text-secondary"
            onPress={switchToken}
          >
            <ArrowUpDown />
          </Button>
          <Separator className="flex-1 bg-secondary" />
        </View>
        {toTokenSet && (
          <TokenWithAmount
            tokenSet={toTokenSet}
            changeToken={setToToken}
            amount={toAmount}
          />
        )}
        {fromToken &&
          fromToken.decimals &&
          fromToken.chainId &&
          toToken &&
          toToken.decimals && (
            <OnChainActionButtonWarper
              variant="secondary"
              className="mt-6"
              targetChainId={fromToken.chainId}
              allowanceParams={allowanceParams}
              warpedButton={
                <Button
                  variant="secondary"
                  className="mt-6"
                  disabled={
                    !fromTokenBalance ||
                    fromTokenBalance < Number(fromAmount) ||
                    fetchingPrice ||
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
              }
            />
          )}
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
  // console.log("TokenWithAmount", tokenSet, amount);
  const [token, setToken] = useState(
    tokenSet.defaultToken || NATIVE_TOKEN_METADATA,
  );

  useEffect(() => {
    if (token) {
      changeToken?.(token);
      setAmount?.(DEFAULT_AMOUNT);
    }
  }, [token]);

  const price = Number(token?.tradeInfo?.stats?.token_price_usd) || 0;

  return (
    <View className="flex gap-2">
      <View className="flex-row items-center justify-between">
        {tokenSet.type === TokenType.USER_TOKENS ? (
          <UserTokenSelect
            defaultToken={tokenSet.defaultToken}
            selectToken={setToken}
            variant={"dropdown"}
          />
        ) : tokenSet.type === TokenType.COMMUNITY_TOKENS ? (
          <CommunityTokenSelect
            defaultToken={tokenSet.defaultToken}
            selectToken={setToken}
            chainId={DEFAULT_CHAINID}
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
        {account.address && token && (
          <View className="flex-row items-center gap-2">
            <Text className="text-xs font-medium text-secondary">Balance:</Text>
            {token.address === NATIVE_TOKEN_METADATA.address ? (
              <NativeTokenBalance
                chainId={token.chainId}
                address={account.address}
                setBalance={setBalance}
              />
            ) : (
              <ERC20TokenBalance
                token={token}
                address={account.address}
                setBalance={setBalance}
              />
            )}
          </View>
        )}
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
