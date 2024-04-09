import {
  FarcasterWithMetadata,
  useConnectWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import React, { useMemo } from "react";
import { Pressable, View, Text } from "react-native";
import { getUserFarcasterAccount, getUserWallets } from "~/utils/privy";
import { PlusCircle, MinusCircle, Wallet } from "../../common/Icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../../ui/select";
import { shortPubKey } from "~/utils/shortPubKey";
import { useAccount } from "wagmi";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { Image } from "expo-image";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";

export default function Wallets() {
  const {
    ready,
    user,
    linkWallet,
    unlinkWallet,
    linkFarcaster,
    unlinkFarcaster,
  } = usePrivy();

  const { authenticated } = useAuth();

  const linkedWallets = useMemo(
    () => (user ? getUserWallets(user) : []),
    [user],
  );
  const { wallets: connectedWallets } = useWallets();
  const unconnectedWallets = useMemo(() => {
    return linkedWallets.filter(
      (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
    );
  }, [linkedWallets, connectedWallets]);

  const { address: activeWalletAddress } = useAccount();
  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    return connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
  }, [connectedWallets, activeWalletAddress]);

  const { setActiveWallet } = useSetActiveWallet();
  const { connectWallet } = useConnectWallet();

  const farcasterAccount = getUserFarcasterAccount(user);

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Select
      className="w-40"
      defaultValue={{
        value: activeWallet?.address || "",
        label: activeWallet?.address || "",
      }}
      onValueChange={async (item) => {
        const newActiveWallet = connectedWallets.find(
          (wallet) => wallet.address === item?.value,
        );
        // console.log("selected", item, connectedWallets, newActiveWallet);
        if (newActiveWallet) await setActiveWallet(newActiveWallet);
      }}
    >
      <SelectTrigger className="w-full bg-white bg-opacity-50 rounded-full">
        {/* <SelectValue
          className="native:text-lg text-sm text-foreground"
          placeholder="Select a wallet"
        /> */}
        <View className="flex-row items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <Text className="text-primary font-bold">
            {shortPubKey(activeWallet?.address || "")}
          </Text>
        </View>
      </SelectTrigger>
      <SelectContent className="flex w-full p-0">
        <SelectGroup>
          {connectedWallets.map((wallet) => (
            <SelectItem
              className="pl-2"
              key={wallet.address}
              label={shortPubKey(wallet.address)}
              value={wallet.address}
            >
              <View className="w-full flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Wallet
                    className={cn(
                      "size-4",
                      wallet.address === activeWallet?.address &&
                        "fill-secondary",
                    )}
                  />
                  <Text
                    className={cn(
                      wallet.address === activeWallet?.address &&
                        "font-bold text-primary",
                    )}
                  >
                    {shortPubKey(wallet.address)}
                  </Text>
                </View>
                {!(wallet.connectorType === "embedded") && (
                  <Pressable
                    onPress={async (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      console.log("unlinking wallet", wallet.address);
                      await unlinkWallet(wallet.address);
                    }}
                  >
                    <MinusCircle className="size-4" />
                  </Pressable>
                )}
              </View>
            </SelectItem>
          ))}
        </SelectGroup>
        <View className="flex w-full items-center gap-[10px] p-2">
          {unconnectedWallets.map((wallet) => (
            <View
              className="w-full flex-row items-center justify-between"
              key={wallet.address}
            >
              <Pressable
                className="flex-row items-center gap-2"
                onPress={async (event) => {
                  await connectWallet();
                }}
              >
                <Wallet className="size-4" />
                <Text>{shortPubKey(wallet.address)}</Text>
              </Pressable>
              <Pressable
                onPress={async (event) => {
                  console.log("unlinking wallet", wallet.address);
                  await unlinkWallet(wallet.address);
                }}
              >
                <MinusCircle className="size-4" />
              </Pressable>
            </View>
          ))}
          <Pressable
            className="w-full flex-row items-center justify-between gap-2"
            onPress={linkWallet}
          >
            <View className="flex-row items-center gap-2">
              <Wallet className="size-4" />
              <Text>Link a wallet</Text>
            </View>
            <PlusCircle className="size-4" />
          </Pressable>
          {farcasterAccount?.fid ? (
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("~/assets/images/farcaster.png")}
                  style={{ width: 16, height: 16 }}
                />
                <Text>
                  {farcasterAccount.displayName || farcasterAccount.username}
                </Text>
              </View>
              <Pressable
                onPress={async (event) => {
                  console.log("unlinking farcaster", farcasterAccount.fid);
                  if (farcasterAccount?.fid)
                    await unlinkFarcaster(farcasterAccount.fid);
                }}
              >
                <MinusCircle className="size-4" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="w-full flex-row items-center justify-between gap-2"
              onPress={linkFarcaster}
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("~/assets/images/farcaster.png")}
                  style={{ width: 16, height: 16 }}
                />
                <Text>Link a Farcaster</Text>
              </View>
              <PlusCircle className="size-4" />
            </Pressable>
          )}
        </View>
      </SelectContent>
    </Select>
  );
}