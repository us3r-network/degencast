import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { Chain, parseEther } from "viem";
import {
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN } from "~/constants";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { TokenWithValue } from "../common/TokenInfo";
import { Input } from "../ui/input";
import ActiveWallet from "./ActiveWallet";
import {
  ErrorInfo,
  TransactionSuccessInfo,
  TransationData,
} from "./TranasactionResult";
import ToeknSelect from "./UserTokenSelect";
import { base } from "viem/chains";

export default function WithdrawButton({
  defaultChain = DEFAULT_CHAIN,
}: {
  defaultChain?: Chain;
}) {
  // console.log("SendButton tokens", availableTokens);
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
        <Button size="sm" className={cn("p-0")} variant={"link"}>
          <Text className="text-xs text-secondary">Withdraw</Text>
        </Button>
      </DialogTrigger>
      {!transationData && !error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Withdraw</DialogTitle>
            <ActiveWallet />
          </DialogHeader>
          <SendToken
            chain={defaultChain}
            onSuccess={setTransationData}
            onError={setError}
          />
        </DialogContent>
      )}
      {transationData && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionSuccessInfo
            data={transationData}
            buttonText="Withdraw more"
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

const SendToken = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    chain: Chain;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, chain, onSuccess, onError, ...props }, ref) => {
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();

  const [address, setAddress] = useState<`0x${string}`>();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();
  const {
    data: hash,
    isPending,
    sendTransaction,
    error,
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

  const send = async () => {
    // console.log("Send", { address, amount, token });
    if (address && amount && token) {
      sendTransaction({ to: address, value: parseEther(amount) });
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     setAmount(String(token?.balance) || "0");
  //   }
  // }, [token]);

  useEffect(() => {
    if (isSuccess && transactionReceipt && address && token && amount) {
      const transationData = {
        transactionReceipt,
        description: (
          <View className="flex items-center gap-2">
            <View className="flex-row items-center gap-2">
              <Text>Withdraw</Text>
              <TokenWithValue token={token} value={amount} />
            </View>
            <Text>from {address}</Text>
          </View>
        ),
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error || transationError) {
      onError?.("Something Wrong!");
    }
  }, [error, transationError]);

  return (
    <View className="flex gap-4">
      <View className="flex-row items-center justify-between">
        <Text>Wallet address</Text>
        <Text className="text-sm">Only sending on Base</Text>
      </View>
      <Input
        className="border-secondary text-secondary"
        placeholder="Enter wallet address"
        value={address}
        onChangeText={(newText) => setAddress(newText as `0x${string}`)}
      />
      <View className="flex-row items-center justify-between">
        <Text>Token</Text>
      </View>
      <ToeknSelect selectToken={setToken} chain={chain} />
      {token && (
        <>
          <View className="flex-row items-center justify-between">
            <Text>Amount</Text>
          </View>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
          />
          {chainId === token?.chainId ? (
            <Button
              variant={"secondary"}
              disabled={
                !address ||
                Number(amount) > Number(token?.balance || 0) ||
                isPending ||
                transationLoading
              }
              className="w-full"
              onPress={send}
            >
              <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              disabled={switchChainStatus === "pending"}
              onPress={async () => {
                await switchChain({ chainId: token.chainId });
              }}
            >
              <Text>Switch to {base.name}</Text>
            </Button>
          )}
        </>
      )}
    </View>
  );
});
