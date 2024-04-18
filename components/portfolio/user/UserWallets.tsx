import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import {
  LogOut,
  MinusCircle,
  PlusCircle,
  Wallet,
} from "~/components/common/Icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";
import { getUserFarcasterAccount, getUserWallets } from "~/utils/privy";
import { shortPubKey } from "~/utils/shortPubKey";

export default function Wallets() {
  const {
    ready,
    user,
    logout,
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
      className="w-50"
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
      <SelectTrigger className="w-full rounded-full bg-white/50">
        <View className="flex-row items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <Text className="font-bold text-primary">
            {shortPubKey(activeWallet?.address || "")}
          </Text>
        </View>
      </SelectTrigger>
      <SelectContent className="flex w-full p-0">
        <SelectGroup>
          {connectedWallets.map((wallet) => (
            <SelectItem
              asChild
              className="pl-2"
              key={wallet.address}
              label={shortPubKey(wallet.address)}
              value={wallet.address}
            >
              <View className="w-full flex-row items-center justify-between gap-2">
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
                  <UnlinkButton
                    action={() => {
                      console.log("unlinking wallet", wallet.address);
                      unlinkWallet(wallet.address);
                    }}
                  />
                )}
              </View>
            </SelectItem>
          ))}
        </SelectGroup>
        <View className="flex w-full gap-[10px] p-2">
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
              <UnlinkButton
                action={() => {
                  console.log("unlinking farcaster", farcasterAccount.fid);
                  if (farcasterAccount?.fid)
                    unlinkFarcaster(farcasterAccount.fid);
                }}
              />
            </View>
          ))}
          {/* link wallet */}
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
          {/* link farcaster */}
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
              <UnlinkButton
                action={() => {
                  console.log("unlinking farcaster", farcasterAccount.fid);
                  if (farcasterAccount?.fid)
                    unlinkFarcaster(farcasterAccount.fid);
                }}
              />
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
          {/* logout */}
          <LogoutButton action={logout} />
        </View>
      </SelectContent>
    </Select>
  );
}

function UnlinkButton({ action }: { action: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Pressable onPress={() => setOpen(true)}>
          <MinusCircle className="size-4" />
        </Pressable>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-screen">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2 text-primary-foreground">
            Notice
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc text-primary-foreground">
          Are you sure you want to disconnect the wallet? You may miss the
          airdrop claim prompt.
        </AlertDialogDescription>
        <View className="w-full flex-row items-center justify-stretch gap-2">
          <Button
            variant={"secondary"}
            className="flex-1"
            onPress={() => setOpen(false)}
          >
            <Text>No</Text>
          </Button>
          <Button variant={"secondary"} className="flex-1" onPress={action}>
            <Text>Yes</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LogoutButton({ action }: { action: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Pressable
          className="w-full flex-row items-center gap-2"
          onPress={() => setOpen(true)}
        >
          <LogOut className="size-4" />
          <Text>Logout</Text>
        </Pressable>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-screen bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2 text-primary-foreground">
            Notice
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc text-primary-foreground">
          Are you sure you want to log out?
        </AlertDialogDescription>
        <View className="w-full flex-row items-center justify-stretch gap-2">
          <Button
            variant={"secondary"}
            className="flex-1"
            onPress={() => setOpen(false)}
          >
            <Text>No</Text>
          </Button>
          <Button variant={"secondary"} className="flex-1" onPress={action}>
            <Text>Yes</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
