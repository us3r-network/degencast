import * as Clipboard from "expo-clipboard";
import React from "react";
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
import useAuth from "~/hooks/user/useAuth";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";
import { LinkWallets, WalletItem } from "../user/UserSettings";
import { ZERO_ADDRESS } from "~/constants";

export default function UserWalletSelect({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { ready, authenticated } = useAuth();
  const { connectedExternalWallet, activeWallet, setActiveWallet } =
    useWalletAccount();

  if (!ready || !authenticated) {
    return null;
  }

  if (disabled) {
    if (activeWallet && connectedExternalWallet.includes(activeWallet))
      return (
        <View className="mr-2 flex-row items-center gap-1">
          <WalletIcon type={activeWallet.walletClientType || ""} />
          <Text className="text-white/80">
            {shortPubKey(activeWallet.address || "")}
          </Text>
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
          activeWallet && connectedExternalWallet.includes(activeWallet)
            ? {
                label: activeWallet.address,
                value: activeWallet.address,
              }
            : {
                label: "Select Wallet",
                value: ZERO_ADDRESS,
              }
        }
        onValueChange={async (item) => {
          const newActiveWallet = connectedExternalWallet.find(
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
          {activeWallet && connectedExternalWallet.includes(activeWallet) ? (
            <View className="mr-2 flex-row items-center gap-1">
              <WalletIcon type={activeWallet.walletClientType || ""} />
              <Text className="text-primery">
                {shortPubKey(activeWallet.address || "")}
              </Text>
            </View>
          ) : (
            <View className="mr-2 flex-row items-center gap-1">
              <WalletIcon type="" />
              <Text className="text-primery">Select Wallet</Text>
            </View>
          )}
        </SelectTrigger>
        <SelectContent className="flex items-start gap-4 divide-solid">
          <View className="flex items-start gap-4 divide-solid">
            <SelectGroup className={cn("flex gap-2")}>
              {connectedExternalWallet.map((wallet) => (
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
              <LinkWallets />
            </SelectGroup>
          </View>
        </SelectContent>
      </Select>
    </TextClassContext.Provider>
  );
}
