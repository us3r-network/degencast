import { useConnectCoinbaseSmartWallet } from "@privy-io/react-auth";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { get } from "lodash";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAccount, useDisconnect } from "wagmi";
import {
  Copy,
  Edit,
  LogOut,
  MinusCircle,
  Plug,
  PlusCircle,
  Settings,
  User,
  Wallet,
} from "~/components/common/Icons";
import { HasSignerIcon } from "~/components/common/SvgIcons";
import { WalletIcon } from "~/components/common/WalletIcon";
import { SlottableViewProps, ViewRef } from "@rn-primitives/types";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text, TextClassContext } from "~/components/ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useAuth from "~/hooks/user/useAuth";
import useWalletAccount, {
  ConnectedWallet,
  WalletWithMetadata,
} from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";

export default function UserSettings({
  showFarcasterAccount = true,
}: {
  showFarcasterAccount?: boolean;
}) {
  const { ready, authenticated } = useAuth();
  const { connectedExternalWallet, setActiveWallet } = useWalletAccount();
  const [open, setOpen] = React.useState(false);

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <TextClassContext.Provider value="text-sm font-medium">
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <Button
            size={"icon"}
            className="size-6 rounded-full border-2 border-white bg-secondary"
          >
            <Text>
              <Settings size={16} />
            </Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <View className="flex items-start gap-4 divide-solid">
            <Catalog
              title="Active Wallets"
              icon={<Wallet className="size-4" />}
            >
              <DropdownMenuGroup className={cn("flex gap-2")}>
                {connectedExternalWallet.map((wallet) => (
                  <DropdownMenuItem
                    asChild
                    className={cn("p-0")}
                    key={wallet.address}
                  >
                    <WalletItem
                      wallet={wallet}
                      action={() => {
                        setActiveWallet(wallet);
                        setOpen(false);
                      }}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <LinkWallets />
              <CreateWallet />
            </Catalog>
            {showFarcasterAccount && (
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
            )}
            <LogoutButton />
          </View>
        </DropdownMenuContent>
      </DropdownMenu>
    </TextClassContext.Provider>
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
        <Text>{title}</Text>
      </View>
      <View className="flex gap-2 pl-4">{children}</View>
    </View>
  );
}

export function LinkWallets() {
  const { ready, authenticated } = useAuth();
  const { unconnectedLinkedWallets, connectWallet, linkWallet } =
    useWalletAccount();

  if (!ready || !authenticated) return null;
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
        // onPress={() => linkWallet()}
        onPointerUp={() => linkWallet()}
      >
        <View className="flex-row items-center gap-2">
          <PlusCircle className="size-4" />
          <Text>Link a wallet</Text>
        </View>
      </Pressable>
    </View>
  );
}

function CreateWallet() {
  const { ready, authenticated } = useAuth();
  const { coinBaseWallet, linkedWallets, connectedWallets } =
    useWalletAccount();
  const { connectCoinbaseSmartWallet } = useConnectCoinbaseSmartWallet();
  if (!ready || !authenticated || coinBaseWallet) return null;
  return (
    <View className="flex w-full gap-2">
      <Pressable
        className="w-full flex-row items-center justify-between gap-2"
        onPointerUp={() => {
          // console.log("connectCoinbaseSmartWallet");
          connectCoinbaseSmartWallet();
        }}
      >
        <View className="flex-row items-center gap-2">
          <PlusCircle className="size-4" />
          <Text>Create a wallet</Text>
        </View>
      </Pressable>
    </View>
  );
}

type WalletItemProps = {
  wallet: ConnectedWallet | WalletWithMetadata;
  action?: () => void;
};

export const WalletItem = React.forwardRef<
  ViewRef,
  SlottableViewProps & WalletItemProps
>(({ wallet, action }, ref) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectedWallets, unlinkWallet, connectWallet } = useWalletAccount();
  return (
    <View className="w-full flex-row items-center justify-between gap-6">
      <Pressable
        className="flex-row items-center gap-2"
        onPointerUp={() => action?.()}
      >
        <WalletIcon type={wallet.walletClientType} />
        <Text>{shortPubKey(wallet.address)}</Text>
      </Pressable>
      {wallet.connectorType === "embedded" ? (
        <View className="flex-row gap-2">
          <Pressable
            className="flex-row items-center gap-2"
            onPointerUp={async (event) => {
              await Clipboard.setStringAsync(wallet.address);
              Toast.show({
                type: "info",
                text1: "Wallet Address Copied!",
              });
            }}
          >
            <Copy className="size-4" />
          </Pressable>
          <Pressable disabled>
            <MinusCircle className="size-4" />
          </Pressable>
        </View>
      ) : (
        <View className="flex-row gap-2">
          {connectedWallets.find((w) => w.address === wallet.address) ? (
            <Pressable
              className="flex-row items-center gap-2"
              onPointerUp={() => disconnect()}
            >
              <Plug className="size-4 fill-secondary/50" />
            </Pressable>
          ) : (
            <Pressable
              className="flex-row items-center gap-2"
              onPointerUp={() =>
                connectWallet({ suggestedAddress: wallet.address })
              }
            >
              <Plug className="size-4" />
            </Pressable>
          )}
          {(get(wallet, "linked") || get(wallet, "type") === "wallet") && (
            <UnlinkButton
              action={() => {
                console.log("unlinking wallet", wallet.address);
                if (address === wallet.address) disconnect();
                unlinkWallet(wallet.address);
              }}
            />
          )}
        </View>
      )}
    </View>
  );
});

function FarcasterAccount() {
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { ready, authenticated } = useAuth();

  const { farcasterAccount, linkFarcaster, unlinkFarcaster } =
    useFarcasterAccount();
  // console.log("farcasterAccount", farcasterAccount);
  if (!ready || !authenticated) return null;
  if (farcasterAccount?.fid) {
    return (
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Avatar alt={farcasterAccount.username || ""} className="size-4">
            <AvatarImage source={{ uri: farcasterAccount.pfp || "" }} />
            <AvatarFallback className="bg-white">
              <User className="size-12 fill-primary/80 text-primary" />
            </AvatarFallback>
          </Avatar>
          <Text className={cn("line-clamp-1 flex-1")}>
            {farcasterAccount.displayName || farcasterAccount.username}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {hasSigner ? (
            <Pressable disabled>
              <HasSignerIcon />
            </Pressable>
          ) : (
            <Pressable
              onPress={(event) => {
                requestSigner();
              }}
            >
              <Edit className="size-4" />
            </Pressable>
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
        onPress={(event) => {
          linkFarcaster();
        }}
      >
        <View className="flex-row items-center gap-2">
          <PlusCircle className="size-4" />
          <Text>Link a Farcaster</Text>
        </View>
      </Pressable>
    );
  }
}

function UnlinkButton({ action }: { action: () => void }) {
  const [open, setOpen] = useState(false);
  const { linkAccountNum } = useWalletAccount();
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Pressable
          onPress={(event) => {
            console.log("unlinking");
            setOpen(true);
          }}
          disabled={linkAccountNum <= 1}
        >
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
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Pressable
          className="w-full flex-row items-center gap-2"
          onPress={(event) => {
            setOpen(true);
          }}
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
          <Button variant={"secondary"} className="flex-1" onPress={logout}>
            <Text>Yes</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
