import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
  parseEther,
} from "viem";
import { ArrowDown, Copy } from "~/components/common/Icons";
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
import useWalletAccount, {
  ConnectedWallet,
} from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";
import UserTokens from "../portfolio/tokens/UserTokens";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import FundButton from "./FundButton";

export default function DepositButton() {
  const {
    connectWallet,
    activeWallet,
    connectedExternalWallet,
  } = useWalletAccount();

  if (!activeWallet)
    return (
      <Button
        size={"icon"}
        className="rounded-full"
        onPress={() => connectWallet}
      >
        <Text>
          <ArrowDown />
        </Text>
      </Button>
    );
  else
    return (
      <Dialog>
        <DialogTrigger
          asChild
          disabled={
            activeWallet?.connectorType !== "embedded" &&
            activeWallet?.connectorType !== "coinbase_wallet"
          }
        >
          <Button size={"icon"} className="rounded-full">
            <Text>
              <ArrowDown />
            </Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Deposit</DialogTitle>
          </DialogHeader>
          <View className="flex gap-6">
            <UserTokens address={activeWallet.address as Address} />
            <View className=" w-full flex-row items-center justify-between gap-2 rounded-lg border-2 border-secondary/50">
              <Text className="ml-2 line-clamp-1 flex-1 text-secondary/50">
                {activeWallet.address as Address}
              </Text>
              <Button
                size="icon"
                variant="ghost"
                onPress={async (event) => {
                  await Clipboard.setStringAsync(
                    activeWallet.address as Address,
                  );
                  Toast.show({
                    type: "info",
                    text1: "Wallet Address Copied!",
                  });
                }}
              >
                <Copy className="size-4 text-white" />
              </Button>
            </View>
            <Text className="text-sm">
              Copy the wallet address and paste it into your crypto wallet to
              transfer. Only sending on Base.
            </Text>
            <FundButton variant="text" />
            {!!connectedExternalWallet ? (
              <TransferFromExternalWallet
                fromWallet={connectedExternalWallet}
                toWallet={activeWallet}
              />
            ) : (
              <Button variant="secondary" onPress={() => connectWallet()}>
                <Text>Connect your wallet & transfer</Text>
              </Button>
            )}
          </View>
        </DialogContent>
      </Dialog>
    );
}

function TransferFromExternalWallet({
  fromWallet,
  toWallet,
}: {
  fromWallet: ConnectedWallet;
  toWallet: ConnectedWallet;
}) {
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const publicClient = createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(),
    });
    publicClient
      .getBalance({
        address: fromWallet.address as Address,
      })
      .then((rawBalance) => {
        const b = parseFloat(
          formatUnits(rawBalance, NATIVE_TOKEN_METADATA.decimals!),
        );
        setBalance(b);
        setAmount(String(b / 10));
      });
  }, [fromWallet]);

  const transfer = async () => {
    const value = parseEther(amount);
    try {
      const provider = await fromWallet.getEthereumProvider();
      const client = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(provider),
      });
      // console.log("client", client, fromWallet, toWallet, value)
      if (client.chain.id !== DEFAULT_CHAIN.id)
        await client.switchChain(DEFAULT_CHAIN);
      const hash = await client.sendTransaction({
        account: fromWallet.address as Address,
        to: toWallet.address as Address,
        value,
      });
      Toast.show({
        type: "success",
        text1: "Transfer Completeed!",
        // text2: `Transaction Hash: ${hash}`,
      });
    } catch (e: any) {
      console.log("error", e);
      Toast.show({
        type: "error",
        text1: "Failed to transfer",
      });
    }
  };
  return (
    <View className="flex gap-4">
      <Text className="text-sm">
        Transfer from connected wallet: {shortPubKey(fromWallet.address)}
      </Text>
      <Input
        className="border-secondary text-secondary"
        placeholder="Enter amount"
        value={amount}
        onChangeText={(newText) => setAmount(newText)}
      />
      <Slider
        value={Number(amount)}
        max={balance}
        step={balance / 100}
        onValueChange={(v) => setAmount(String(v))}
      />
      <Button variant="secondary" onPress={() => transfer()}>
        <Text>
          Transfer{" "}
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 4,
            notation: "compact",
          }).format(Number(amount))}{" "}
          {NATIVE_TOKEN_METADATA.symbol}
        </Text>
      </Button>
    </View>
  );
}
