import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import {
  Cable,
  Copy,
  Edit,
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
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";
import { getUserFarcasterAccount, getUserWallets } from "~/utils/privy";
import { shortPubKey } from "~/utils/shortPubKey";

export default function Wallets() {
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
          <WalletIcon type={activeWallet?.walletClientType || ""} />
          <Text className="font-bold text-primary">
            {shortPubKey(activeWallet?.address || "")}
          </Text>
        </View>
      </SelectTrigger>
      <SelectContent>
        <View className="flex w-60 items-start gap-4 divide-solid">
          <Catalog title="Active Wallets" icon={<Wallet className="size-6" />}>
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
            <LinkWallets />
          </Catalog>
          {/* <Catalog title="Linked Wallets" icon={<Wallet className="size-6" />}>
            <LinkWallets />
          </Catalog> */}
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
      <View className="pl-4 flex gap-2">{children}</View>
    </View>
  );
}

function WalletIcon({ type }: { type: string | undefined }) {
  switch (type) {
    case "privy":
      return (
        <Image
          style={{ width: 24, height: 24 }}
          source={require("~/assets/images/privy-icon.webp")}
        />
      );
    case "metamask":
      return (
        <Image
          style={{ width: 24, height: 24 }}
          source={require("~/assets/images/metamask-icon.svg")}
        />
      );
    default:
      return <Wallet className="size-6" />;
  }
}

function LinkWallets() {
  const { user, linkWallet, unlinkWallet } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { wallets: connectedWallets } = useWallets();
  const linkedWallets = useMemo(
    () => (user ? getUserWallets(user) : []),
    [user],
  );
  const unconnectedLinkedWallets = useMemo(() => {
    return linkedWallets.filter(
      (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
    );
  }, [linkedWallets, connectedWallets]);


  if (!user) return null;
  return (
    <View className="flex w-full gap-2">
      {unconnectedLinkedWallets.map((wallet) => (
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
                  <Text>
                    Copy the embeded wallet address and paste it into your
                    crypto wallet to transfer.{" "}
                  </Text>
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
              {connectedWallets.find((w) => w.address === wallet.address) ? (
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <Pressable
                      disabled
                      className="flex-row items-center gap-2"
                      onPress={async (event) => {
                        await connectWallet();
                      }}
                    >
                      <Plug className="size-4 fill-secondary/50" />
                    </Pressable>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text>Connected Wallet</Text>
                  </TooltipContent>
                </Tooltip>
              ) : (
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
                    <Text>Connect This Linked Wallet</Text>
                  </TooltipContent>
                </Tooltip>
              )}

              <UnlinkButton
                action={() => {
                  console.log("unlinking wallet", wallet.address);
                  unlinkWallet(wallet.address);
                }}
              />
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
          <PlusCircle className="size-6" />
          <Text>Link a wallet</Text>
        </View>
      </Pressable>
    </View>
  );
}

function FarcasterAccount() {
  const { user, linkFarcaster, unlinkFarcaster } = usePrivy();
  const { prepareWrite } = useFarcasterWrite();
  if (!user) return null;
  const farcasterAccount = getUserFarcasterAccount(user);
  // console.log("farcasterAccount", farcasterAccount);
  if (farcasterAccount?.fid) {
    return (
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Avatar alt={farcasterAccount.username || ""} className="size-6">
            <AvatarImage source={{ uri: farcasterAccount.pfp || "" }} />
            <AvatarFallback className="bg-white">
              <User className="size-12 fill-primary/80 font-bold text-primary" />
            </AvatarFallback>
          </Avatar>
          <Text className={cn("line-clamp-1 flex-1")}>
            {farcasterAccount.displayName || farcasterAccount.username}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {farcasterAccount.signerPublicKey ? (
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Pressable disabled>
                  <Edit className="size-4 fill-secondary/50" />
                </Pressable>
              </TooltipTrigger>
              <TooltipContent>
                <Text>
                  Farcaster Signer: {farcasterAccount.signerPublicKey}
                </Text>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Pressable onPress={prepareWrite}>
                  <Cable className="size-4" />
                </Pressable>
              </TooltipTrigger>
              <TooltipContent>
                <Text>Request Farcaster Signer to Write</Text>
              </TooltipContent>
            </Tooltip>
          )}
          <UnlinkButton
            action={() => {
              console.log("unlinking farcaster", farcasterAccount.fid);
              if (farcasterAccount?.fid) unlinkFarcaster(farcasterAccount.fid);
            }}
          />
        </View>
      </View>
    );
  } else {
    return (
      <Pressable
        className="w-full flex-row items-center justify-between gap-2"
        onPress={linkFarcaster}
      >
        <View className="flex-row items-center gap-2">
          <PlusCircle className="size-6" />
          <Text>Link a Farcaster</Text>
        </View>
        <PlusCircle className="size-6" />
      </Pressable>
    );
  }
}

function UnlinkButton({ action }: { action: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Pressable onPress={() => setOpen(true)}>
              <MinusCircle className="size-4" />
            </Pressable>
          </TooltipTrigger>
          <TooltipContent>
            <Text>Unlink</Text>
          </TooltipContent>
        </Tooltip>
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
          <LogOut className="size-6" />
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
