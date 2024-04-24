import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import {
  Copy,
  LogOut,
  MinusCircle,
  Plug,
  PlusCircle,
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";
import { getUserFarcasterAccount, getUserWallets } from "~/utils/privy";
import { shortPubKey } from "~/utils/shortPubKey";

export default function Wallets() {
  const { ready, user } = usePrivy();
  const { authenticated } = useAuth();
  const { setActiveWallet } = useSetActiveWallet();

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

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Select
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
      <SelectTrigger className={cn("w-full rounded-full bg-white/50")}>
        <View className="mr-2 flex-row items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <Text className="font-bold text-primary">
            {shortPubKey(activeWallet?.address || "")}
          </Text>
        </View>
      </SelectTrigger>
      <SelectContent>
        <View className="flex w-60 items-start gap-4 divide-solid">
          <Catalog
            title="Connected Wallets"
            icon={<Wallet className="size-4" />}
          >
            <SelectGroup className={cn("flex gap-2")}>
              {connectedWallets.map((wallet) => (
                <SelectItem
                  asChild
                  className="p-0"
                  key={wallet.address}
                  label={shortPubKey(wallet.address)}
                  value={wallet.address}
                >
                  <View className="w-full flex-row items-center justify-between gap-2">
                    <View className="flex-row items-center gap-2">
                      <WalletIcon type={wallet.walletClientType} />
                      <Text
                        className={cn(
                          wallet.address === activeWallet?.address &&
                            "font-bold text-primary",
                        )}
                      >
                        {shortPubKey(wallet.address)}
                      </Text>
                    </View>
                  </View>
                </SelectItem>
              ))}
            </SelectGroup>
          </Catalog>
          <Catalog title="Linked Wallets" icon={<Wallet className="size-4" />}>
            <LinkWallets />
          </Catalog>
          <Catalog
            title="Farcaster Account"
            icon={
              <Image
                source={require("~/assets/images/farcaster.png")}
                style={{ width: 16, height: 16 }}
              />
            }
          >
            <FarcasterAccount />
          </Catalog>
          <LogoutButton />
        </View>
      </SelectContent>
    </Select>
  );
}

type CatalogProps = {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
};

function Catalog({ title, icon, children }: CatalogProps) {
  return (
    <View className="flex w-full cursor-default gap-2">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="font-bold">{title}</Text>
      </View>
      <View className="pl-4">{children}</View>
    </View>
  );
}

function WalletIcon({ type }: { type: string | undefined }) {
  switch (type) {
    case "privy":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/privy-icon.webp")}
        />
      );
    case "metamask":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/metamask-icon.svg")}
        />
      );
    default:
      return <Wallet className="size-4" />;
  }
}

function LinkWallets() {
  const { user, linkWallet, unlinkWallet } = usePrivy();
  const { connectWallet } = useConnectWallet();

  const linkedWallets = useMemo(
    () => (user ? getUserWallets(user) : []),
    [user],
  );
  if (!user) return null;
  console.log("linkedWallets", linkedWallets);
  return (
    <View className="flex w-full gap-2">
      {linkedWallets.map((wallet) => (
        <View
          className="w-full flex-row items-center justify-between"
          key={wallet.address}
        >
          <View className="flex-row items-center gap-2">
            <WalletIcon type={wallet.walletClientType} />
            <Text>{shortPubKey(wallet.address)}</Text>
          </View>
          {wallet.connectorType === "embedded" ? (
            <View className="flex-row gap-2">
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={async (event) => {
                      await Clipboard.setStringAsync(wallet.address);
                    }}
                  >
                    <Copy className="size-4" />
                  </Pressable>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>Copy Privy Embeded Wallet Address</Text>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Pressable disabled>
                    <MinusCircle className="size-4" />
                  </Pressable>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>Privy Embeded Wallet Could NOT Be Remove</Text>
                </TooltipContent>
              </Tooltip>
            </View>
          ) : (
            <View className="flex-row gap-2">
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={async (event) => {
                      await connectWallet();
                    }}
                  >
                    <Plug className="size-4" />
                  </Pressable>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>Connect Linked Wallet Address</Text>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <UnlinkButton
                    action={() => {
                      console.log("unlinking wallet", wallet.address);
                      unlinkWallet(wallet.address);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <Text>Unlink Wallet</Text>
                </TooltipContent>
              </Tooltip>
            </View>
          )}
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
    </View>
  );
}

function FarcasterAccount() {
  const { user, linkFarcaster, unlinkFarcaster } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  if (!user) return null;
  if (farcasterAccount?.fid) {
    return (
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Avatar alt={farcasterAccount.username || ""} className="size-4">
            <AvatarImage source={{ uri: farcasterAccount.pfp || "" }} />
            <AvatarFallback className="bg-white">
              <User className="size-12 fill-primary/80 font-bold text-primary" />
            </AvatarFallback>
          </Avatar>
          <Text className={cn("line-clamp-1 flex-1")}>
            {farcasterAccount.displayName || farcasterAccount.username}
          </Text>
        </View>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <UnlinkButton
              action={() => {
                console.log("unlinking farcaster", farcasterAccount.fid);
                if (farcasterAccount?.fid)
                  unlinkFarcaster(farcasterAccount.fid);
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <Text>Unlink Farcaster Account</Text>
          </TooltipContent>
        </Tooltip>
      </View>
    );
  } else {
    return (
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
    );
  }
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

function LogoutButton() {
  const { logout } = usePrivy();
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Pressable
          className="w-full flex-row items-center gap-2"
          onPress={() => setOpen(true)}
        >
          <LogOut className="size-4" />
          <Text className="font-bold">Logout</Text>
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
          <Button variant={"secondary"} className="flex-1" onPress={logout}>
            <Text>Yes</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
