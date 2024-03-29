import {
  ConnectedWallet,
  FarcasterWithMetadata,
  useConnectWallet,
  useLinkAccount,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import React, { useMemo } from "react";
import { Pressable, View, Text } from "react-native";
import { getUserWallets } from "~/utils/privy";
import { PlusCircle, MinusCircle, Wallet } from "../Icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { shortPubKey } from "~/utils/shortPubKey";
import { useAccount } from "wagmi";
import { useSetActiveWallet } from "@privy-io/wagmi";

export default function wallets() {
  const {
    ready,
    authenticated,
    user,
    linkWallet,
    unlinkWallet,
    linkFarcaster,
    unlinkFarcaster,
  } = usePrivy();

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
  console.log("activeWalletAddress", activeWalletAddress)
  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    return connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
  }, [connectedWallets, activeWalletAddress]);

  const { setActiveWallet } = useSetActiveWallet();
  const { connectWallet } = useConnectWallet();

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Select
      className="w-[200px]"
      defaultValue={{
        value: activeWallet?.address || "",
        label: activeWallet?.address || "",
      }}
      onValueChange={async (item) => {
        const newActiveWallet = connectedWallets.find(
          (wallet) => wallet.address === item?.value,
        );
        console.log("selected", item, connectedWallets, newActiveWallet);
        if (newActiveWallet) await setActiveWallet(newActiveWallet);
      }} 
    >
      <SelectTrigger className="w-full">
        {/* <SelectValue
          className="native:text-lg text-sm text-foreground"
          placeholder="Select a wallet"
        /> */}
        <View className="flex-row items-center gap-2">
          <Wallet />
          <Text>{shortPubKey(activeWallet?.address || "")}</Text>
        </View>
      </SelectTrigger>
      <SelectContent className="flex w-full">
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
                  <Wallet />
                  <Text>{shortPubKey(wallet.address)}</Text>
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
                    <MinusCircle />
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
                <Wallet />
                <Text>{shortPubKey(wallet.address)}</Text>
              </Pressable>
              <Pressable
                onPress={async (event) => {
                  console.log("unlinking wallet", wallet.address);
                  await unlinkWallet(wallet.address);
                }}
              >
                <MinusCircle />
              </Pressable>
            </View>
          ))}
          <Pressable
            className="w-full flex-row items-center justify-between gap-2"
            onPress={linkWallet}
          >
            <View className="flex-row items-center gap-2">
              <Wallet />
              <Text>Link a wallet</Text>
            </View>
            <PlusCircle />
          </Pressable>
          {farcasterAccount?.fid ? (
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Wallet />
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
                <MinusCircle />
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="w-full flex-row items-center justify-between gap-2"
              onPress={linkFarcaster}
            >
              <View className="flex-row items-center gap-2">
                <Wallet />
                <Text>Link a Farcaster</Text>
              </View>
              <PlusCircle />
            </Pressable>
          )}
        </View>
      </SelectContent>
    </Select>
  );
}
