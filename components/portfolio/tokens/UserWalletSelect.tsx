import * as Clipboard from "expo-clipboard";
import React from "react";
import { isDesktop } from "react-device-detect";
import { View } from "react-native";
import { WalletIcon } from "~/components/common/WalletIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Text, TextClassContext } from "~/components/ui/text";
import { ZERO_ADDRESS } from "~/constants";
import useAuth from "~/hooks/user/useAuth";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";
import { LinkWallets, WalletItem } from "../user/UserSettings";

export default function UserWalletSelect({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { ready, authenticated } = useAuth();
  const {
    connectedWallets,
    activeWallet,
    setActiveWallet,
    getActualUseWalletAddress,
  } = useWalletAccount();

  if (!ready || !authenticated) {
    return null;
  }
  const walletAddress = getActualUseWalletAddress();
  console.log("activeWallet", walletAddress);
  if (disabled) {
    if (activeWallet && connectedWallets.includes(activeWallet))
      return (
        <View className="mr-2 flex-row items-center gap-1">
          <WalletIcon type={activeWallet.walletClientType || ""} />
          <Text className="text-white/80">{shortPubKey(walletAddress)}</Text>
        </View>
      );
    else
      return (
        <View className="mr-2 flex-row items-center gap-1">
          <WalletIcon type="" />
          <Text className="text-primery">No Wallet Connected!</Text>
        </View>
      );
  }
  return (
    <TextClassContext.Provider value="text-sm font-medium">
      <Select
        value={
          activeWallet && connectedWallets.includes(activeWallet)
            ? {
                label: walletAddress,
                value: activeWallet.address,
              }
            : {
                label: "Select Wallet",
                value: ZERO_ADDRESS,
              }
        }
        onValueChange={async (item) => {
          const newActiveWallet = connectedWallets.find(
            (wallet) => wallet.address === item?.value,
          );
          if (newActiveWallet) await setActiveWallet(newActiveWallet);
          await Clipboard.setStringAsync(newActiveWallet?.address || "");
        }}
      >
        <SelectTrigger
          className={cn(
            "h-6 flex-row items-center rounded-full border-none bg-white/40 px-2",
          )}
        >
          {activeWallet && connectedWallets.includes(activeWallet) ? (
            <View className="mr-2 flex-row items-center gap-1">
              <WalletIcon type={activeWallet.walletClientType || ""} />
              <Text className="text-primery">{shortPubKey(walletAddress)}</Text>
            </View>
          ) : (
            <View className="mr-2 flex-row items-center gap-1">
              <WalletIcon type="" />
              <Text className="text-primery">Select Wallet</Text>
            </View>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup
            className={cn(
              "flex w-full items-start gap-2 divide-solid",
              isDesktop ? "p-0" : "p-2",
            )}
          >
            {connectedWallets.map((wallet) => (
              <SelectItem
                asChild
                className="p-0"
                key={wallet.address}
                label={wallet.address}
                value={wallet.address}
              >
                <WalletItem wallet={wallet} />
              </SelectItem>
            ))}
            <LinkWallets />
          </SelectGroup>
        </SelectContent>
      </Select>
    </TextClassContext.Provider>
  );
}
