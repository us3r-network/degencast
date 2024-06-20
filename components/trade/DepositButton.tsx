import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import * as Clipboard from "expo-clipboard";
import { useMemo } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useAccount } from "wagmi";
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
import { cn } from "~/lib/utils";
import UserTokens from "../portfolio/tokens/UserTokens";
import FundButton from "./FundButton";

export default function DepositButton() {
  const { connectWallet } = useConnectWallet();
  const { linkWallet } = usePrivy();
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
          <ArrowDown />
        </Text>
      </Button>
    );
  else
    return (
      <Dialog>
        <DialogTrigger
          asChild
          disabled={activeWallet?.connectorType !== "embedded" && activeWallet?.connectorType !== "coinbase_wallet"}
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
            <UserTokens address={activeWalletAddress} />
            <View className=" w-full flex-row items-center justify-between gap-2 rounded-lg border-2 border-secondary/50">
              <Text className="ml-2 text-secondary/50 flex-1 line-clamp-1">
                {activeWalletAddress}
              </Text>
              <Button
                size="icon"
                variant="ghost"
                onPress={async (event) => {
                  await Clipboard.setStringAsync(activeWalletAddress);
                  Toast.show({
                    type: "info",
                    text1: "Wallet Address Copied!",
                  });
                }}
              >
                <Copy className="size-4 text-white" />
              </Button>
            </View>
            <Text className="text-xs">
              Copy the wallet address and paste it into your crypto wallet to
              transfer. Only sending on Base.
            </Text>
            <FundButton variant="text" />
            <Button variant="secondary" onPress={linkWallet}>
              <Text>Link a new wallet & set active</Text>
            </Button>
          </View>
        </DialogContent>
      </Dialog>
    );
}
