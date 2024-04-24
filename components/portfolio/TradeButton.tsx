// import { useSwitchChain } from "wagmi";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_METADATA } from "~/constants";
import { cn } from "~/lib/utils";
import { TokenInfoWithMetadata } from "~/services/user/types";
import About from "../common/About";
import { TokenInfo } from "../common/TokenInfo";
import { Input } from "../ui/input";

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
        <SwapToken fromToken={fromToken} toToken={toToken} />
        <View className="p-4">
          <About title="Swap & Earn" info={TRADE_INFO} />
        </View>
      </DialogContent>
    </Dialog>
  );
}

const TRADE_INFO = ["Swap 0.01 ETH = 500 Points"];

function SwapToken({
  fromToken,
  toToken,
}: {
  fromToken: TokenInfoWithMetadata;
  toToken?: TokenInfoWithMetadata;
}) {
  // console.log("Trade", fromChain, fromToken, toChain, toToken)
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState(0);
  return (
    <View className="flex w-full gap-4">
      <Token token={fromToken} />
      <Token token={toToken || NATIVE_TOKEN_METADATA} />
      <Button
        variant="secondary"
        onPress={() => {
          // switchChain({ chainId: toChain });
        }}
      >
        <Text>Swap</Text>
      </Button>
    </View>
  );
}

function Token({ token }: { token: TokenInfoWithMetadata }) {
  const [amount, setAmount] = useState("0");
  const price = Number(token.tradeInfo?.stats.token_price_usd) || 0;
  return (
    <View className="flex-row items-start justify-between">
      <View>
        <TokenInfo name={token.name} logo={token.logo} />
        {token.symbol && token.balance && (
          <Text>
            Balance: {token.balance}
            {token.symbol}
          </Text>
        )}
      </View>
      <View className="flex gap-2">
        <Input
          className={cn("w-10 text-white")}
          inputMode="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        {amount && price && (
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
