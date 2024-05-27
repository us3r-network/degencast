import {
  ConnectedWallet,
  WalletWithMetadata,
  useConnectWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import * as Clipboard from "expo-clipboard";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import { Plug, PlusCircle } from "~/components/common/Icons";
import { WalletIcon } from "~/components/common/WalletIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Text, TextClassContext } from "~/components/ui/text";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";
import { getUserWallets } from "~/utils/privy";
import { shortPubKey } from "~/utils/shortPubKey";

export default function UserWalletSelect() {
  const { ready } = usePrivy();
  const { authenticated } = useAuth();

  const { setActiveWallet } = useSetActiveWallet();
  const { wallets: connectedWallets } = useWallets();
  const { address: activeWalletAddress } = useAccount();

  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
    if (currentWallet) return currentWallet;
    const firstInjectedWallet = connectedWallets.find(
      (wallet) => wallet.connectorType === "injected",
    );
    if (firstInjectedWallet) return firstInjectedWallet;
    return connectedWallets[0];
  }, [connectedWallets, activeWalletAddress]);

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <TextClassContext.Provider value="text-sm font-medium">
      <Select
        value={{
          label: activeWallet?.address || "",
          value: activeWallet?.address || "",
        }}
        onValueChange={async (item) => {
          const newActiveWallet = connectedWallets.find(
            (wallet) => wallet.address === item?.value,
          );
          // console.log("selected", item, connectedWallets, newActiveWallet);
          if (newActiveWallet) await setActiveWallet(newActiveWallet);
          await Clipboard.setStringAsync(newActiveWallet?.address || "");
        }}
      >
        <SelectTrigger
          className={cn(
            "h-6 flex-row items-center rounded-full border-none bg-white/40 px-2",
          )}
        >
          <View className="mr-2 flex-row items-center gap-1">
            <WalletIcon type={activeWallet?.walletClientType || ""} />
            <Text className="text-primery">
              {shortPubKey(activeWallet?.address || "")}
            </Text>
          </View>
        </SelectTrigger>
        <SelectContent>
          <View className="flex items-start gap-4 divide-solid">
            <SelectGroup className={cn("flex gap-2")}>
              {connectedWallets.map((wallet) => (
                <SelectItem
                  asChild
                  className={cn("p-0")}
                  key={wallet.address}
                  label={wallet.address}
                  value={wallet.address}
                >
                  <WalletItem wallet={wallet} />
                </SelectItem>
              ))}
            </SelectGroup>
            <LinkWallets />
          </View>
        </SelectContent>
      </Select>
    </TextClassContext.Provider>
  );
}

function LinkWallets() {
  const { user, linkWallet } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { wallets: connectedWallets } = useWallets();
  const linkedWallets = useMemo(
    () => (user ? getUserWallets(user) : []),
    [user],
  );
  const unconnectedLinkedWallets = useMemo(() => {
    return linkedWallets
      .filter(
        (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
      )
      .filter((wallet) => wallet.connectorType !== "embedded");
  }, [linkedWallets, connectedWallets]);

  if (!user) return null;
  return (
    <View className="flex w-full gap-2">
      {unconnectedLinkedWallets.map((wallet) => (
        <WalletItem
          key={wallet.address}
          wallet={wallet}
          action={() => connectWallet()}
        />
      ))}
      {/* link wallet */}
      <Pressable
        className="w-full flex-row items-center justify-between gap-2"
        onPress={linkWallet}
      >
        <View className="flex-row items-center gap-2">
          <PlusCircle className="size-4" />
          <Text>Link a wallet</Text>
        </View>
      </Pressable>
    </View>
  );
}

function WalletItem({
  wallet,
  action,
}: {
  wallet: ConnectedWallet | WalletWithMetadata;
  action?: () => void;
}) {
  const { wallets: connectedWallets } = useWallets();
  return (
    <View
      className="w-full flex-row items-center justify-between gap-6"
      key={wallet.address}
    >
      <Pressable className="flex-row items-center gap-2" onPress={action}>
        <WalletIcon type={wallet.walletClientType} />
        <Text>{shortPubKey(wallet.address)}</Text>
      </Pressable>
      {wallet.connectorType !== "embedded" && (
        <View className="flex-row gap-2">
          {connectedWallets.find((w) => w.address === wallet.address) ? (
            <Pressable
              disabled
              className="flex-row items-center gap-2"
              onPress={action}
            >
              <Plug className="size-4 fill-secondary/50" />
            </Pressable>
          ) : (
            <Pressable className="flex-row items-center gap-2" onPress={action}>
              <Plug className="size-4" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
