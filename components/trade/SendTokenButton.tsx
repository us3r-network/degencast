import { useConnectWallet, useWallets } from "@privy-io/react-auth";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Chain, parseEther } from "viem";
import { base } from "viem/chains";
import {
  useAccount,
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
import { shortPubKey } from "~/utils/shortPubKey";
import { TokenWithValue } from "../common/TokenInfo";
import { Input } from "../ui/input";
import ActiveWallet from "./ActiveWallet";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import ToeknSelect from "./UserTokenSelect";
import { ArrowUp } from "~/components/common/Icons";

export default function SendTokenButton({
  defaultChain = DEFAULT_CHAIN,
}: {
  defaultChain?: Chain;
}) {
  // console.log("SendButton tokens", availableTokens);
  const [sending, setSending] = useState(false);

  const { connectWallet } = useConnectWallet();

  const { wallets: connectedWallets } = useWallets();
  const { address: activeWalletAddress } = useAccount();

  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
    if (currentWallet) return currentWallet;

  }, [connectedWallets, activeWalletAddress]);

  if (!activeWalletAddress)
    return (
      <Button size={"icon"} className="rounded-full" onPress={connectWallet}>
        <Text>
          <ArrowUp />
        </Text>
      </Button>
    );
  else
    return (
      <Dialog
        onOpenChange={() => {
          setSending(false);
        }}
      >
        <DialogTrigger asChild disabled={activeWallet?.connectorType!=="embedded"}>
          <Button size={"icon"} className="rounded-full">
            <Text>
            <ArrowUp />
            </Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>{!sending ? "Withdraw" : "Transaction"}</DialogTitle>
            {!sending && <ActiveWallet />}
          </DialogHeader>
          <SendToken chain={defaultChain} setSending={setSending} />
        </DialogContent>
      </Dialog>
    );
}

const SendToken = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    chain: Chain;
    setSending?: (swaping: boolean) => void;
  }
>(({ className, chain, setSending, ...props }, ref) => {
  const account = useAccount();
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();

  const [address, setAddress] = useState<`0x${string}`>();
  const [amount, setAmount] = useState("");
  const [transationData, setTransationData] = useState<TransationData>();
  const [transationError, setTransationError] = useState<string>();

  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();
  const {
    data: hash,
    isPending,
    sendTransaction,
    error,
    reset,
  } = useSendTransaction();
  const {
    data: transactionReceipt,
    error: transactionReceiptError,
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

  useEffect(() => {
    if (
      address &&
      token &&
      amount &&
      (isPending || (isSuccess && transactionReceipt))
    ) {
      const transationData = {
        chain: base,
        transactionReceipt,
        description: (
          <View className="flex w-full items-center gap-2">
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">From</Text>
              <Text className="font-medium text-secondary">
                {shortPubKey(account?.address as string)}
              </Text>
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">To</Text>
              <Text className="font-medium text-secondary">
                {shortPubKey(address)}
              </Text>
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <Text className="font-medium text-secondary">Value</Text>
              <TokenWithValue token={token} value={amount} />
            </View>
          </View>
        ),
      };
      setTransationData(transationData);
      setSending?.(true);
    }
  }, [isPending, isSuccess, transactionReceipt, transationLoading]);

  useEffect(() => {
    if (error || transactionReceiptError) {
      setTransationData(undefined);
      setTransationError(
        (error as any)?.details ||
          (transactionReceiptError as any)?.details ||
          "Transaction failed!",
      );
    }
  }, [error, transactionReceiptError]);

  useEffect(() => {
    if (error) {
      setTransationData(undefined);
      setTransationError((error as any)?.details || "Transaction failed!");
    }
  }, [error]);

  const tryAgain = () => {
    setTransationData(undefined);
    setTransationError(undefined);
    setSending?.(false);
    reset();
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
      <View className="flex gap-4">
        <View className="flex gap-2">
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
        </View>
        <View className="z-50 flex gap-2">
          <Text>Token</Text>
          <ToeknSelect selectToken={setToken} chain={chain} />
        </View>
        <View className="flex gap-2">
          <Text>Amount</Text>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
          />
        </View>
        {token &&
          (chainId === token.chainId ? (
            <Button
              variant={"secondary"}
              disabled={
                !address ||
                Number(amount) > Number(token?.balance || 0) ||
                isPending ||
                transationLoading
              }
              onPress={send}
            >
              <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
            </Button>
          ) : (
            <Button
              variant="secondary"
              disabled={switchChainStatus === "pending"}
              onPress={async () => {
                await switchChain({ chainId: token.chainId });
              }}
            >
              <Text>Switch to {base.name}</Text>
            </Button>
          ))}
      </View>
    );
});
