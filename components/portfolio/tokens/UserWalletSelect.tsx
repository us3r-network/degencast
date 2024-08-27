import * as Clipboard from "expo-clipboard";
import React from "react";
import { Pressable, View } from "react-native";
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
import useWalletAccount, {
  ConnectedWallet,
  WalletWithMetadata,
} from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";
import { LinkWallets, WalletItem } from "../user/UserSettings";

export default function UserWalletSelect() {
  const { ready, authenticated } = useAuth();

  const { connectedWallets, linkedWallets, activeWallet, setActiveWallet } =
    useWalletAccount();

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
        <SelectContent className="flex items-start gap-4 divide-solid">
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