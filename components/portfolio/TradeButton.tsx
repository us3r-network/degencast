// import { useSwitchChain } from "wagmi";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN_METADATA } from "~/constants";
import useSwapToken from "~/hooks/trade/useSwapToken";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenInfoWithMetadata } from "~/services/user/types";
import About from "../common/About";
import { ArrowUpDown, Wallet } from "../common/Icons";
import { TokenInfo } from "../common/TokenInfo";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { shortPubKey } from "~/utils/shortPubKey";
import { useConnectWallet } from "@privy-io/react-auth";

export default function TradeButton({
  fromToken,
  toToken,
}: {
  fromToken: TokenInfoWithMetadata;
  toToken?: TokenInfoWithMetadata;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("w-14")}
          size="sm"
          variant={"secondary"}
          // onPress={() => switchChain({ chainId: fromChain })}
        >
          <Text>Trade</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen border-none">
        <DialogHeader>
          <DialogTitle>Trade</DialogTitle>
        </DialogHeader>
        <SwapToken
          token1={fromToken}
          token2={toToken || NATIVE_TOKEN_METADATA}
        />
        <View className="p-4">
          <About title="Swap & Earn" info={TRADE_INFO} />
        </View>
      </DialogContent>
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
}: {
  token1: TokenInfoWithMetadata;
  token2: TokenInfoWithMetadata;
}) {
  // console.log("Trade", fromChain, fromToken, toChain, toToken)
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  const [fromToken, setFromToken] = useState(token1);
  const [toToken, setToToken] = useState(token2);
  const [fromAmount, setFromAmount] = useState(DEFAULT_AMOUNT);
  const [toAmount, setToAmount] = useState(DEFAULT_AMOUNT);

  const fromTokenInfo = useUserToken(
    account.address,
    fromToken.contractAddress,
    fromToken.chainId,
  );
  const toTokenInfo = useUserToken(
    account.address,
    toToken.contractAddress,
    toToken.chainId,
  );
  const nativeTokenInfo = useUserNativeToken(account.address, toToken.chainId);

  useEffect(() => {
    if (
      !fromTokenInfo ||
      !fromTokenInfo.balance ||
      !fromToken ||
      fromToken.contractAddress === NATIVE_TOKEN_METADATA.contractAddress
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
      toToken.contractAddress === NATIVE_TOKEN_METADATA.contractAddress
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
    if (fromToken.contractAddress === NATIVE_TOKEN_METADATA.contractAddress)
      setFromToken({
        ...fromToken,
        balance: nativeTokenInfo.balance,
        symbol: nativeTokenInfo.symbol,
      });
    if (toToken.contractAddress === NATIVE_TOKEN_METADATA.contractAddress)
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
    hash,
    isConfirming,
    isConfirmed,
  } = useSwapToken(account.address);

  useEffect(() => {
    if (!fromAmount || fromAmount === DEFAULT_AMOUNT) {
      return;
    }
    fetchPriceInfo(fromAmount);
  }, [fromAmount]);

  const fetchPriceInfo = async (amount: string) => {
    // console.log("fetchPriceInfo", amount);
    const priceInfo = await fetchPrice({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    });
    if (!priceInfo) return;
    const { buyAmount } = priceInfo;
    setToAmount(buyAmount);
  };

  const swap = async () => {
    // console.log("swap", fromAmount);
    swapToken({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: fromAmount,
    });
  };

  return (
    <View className="flex w-full gap-2">
      {account.address && (
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-secondary">Connected Wallet:</Text>{" "}
          <Text>{shortPubKey(account.address)}</Text>
          <Button variant="link" onPress={connectWallet}>
            <Wallet className="font-bold text-secondary" />
          </Button>
        </View>
      )}
      <Token
        token={fromToken}
        amount={fromAmount}
        setAmount={(amount) => setFromAmount(amount)}
      />
      <View className="flex-row items-center">
        <Separator className="flex-1 text-secondary" />
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
        <Separator className="flex-1 text-secondary" />
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
          isConfirming
        }
        onPress={() => {
          swap();
        }}
      >
        <Text>Swap</Text>
      </Button>
      {hash && (
        <View className="flex gap-2">
          <Text className="font-bold">Transaction Hash:</Text>
          <Link
            className="text-foreground/80"
            href={`${DEFAULT_CHAIN.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
          >
            {hash}
          </Link>
        </View>
      )}
    </View>
  );
}

function Token({
  token,
  amount,
  setAmount,
}: {
  token: TokenInfoWithMetadata;
  amount?: string;
  setAmount?: (amount: string) => void;
}) {
  console.log("Token", token, amount);
  const price = Number(token.tradeInfo?.stats.token_price_usd) || 0;
  return (
    <View className="flex gap-2">
      <View className="flex-row items-start justify-between">
        <TokenInfo name={token.name} logo={token.logo} />
        <Input
          editable={!!setAmount}
          className={cn(
            "max-w-40 rounded-full border-none bg-secondary/20 text-end text-white",
          )}
          inputMode="numeric"
          defaultValue="0"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-secondary">Balance:</Text>
          <Text>
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 4,
              notation: "compact",
            }).format(Number(token.balance) || 0)}{" "}
            {token?.symbol}
          </Text>
        </View>
        {amount && price > 0 && (
          <Text>
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
