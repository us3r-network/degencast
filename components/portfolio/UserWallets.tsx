import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { Pressable, View } from "react-native";
import { getUserWallets } from "~/utils/privy";
import { PlusCircle, Wallet } from "../Icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { shortPubKey } from "~/utils/shortPubKey";

export default function UserWallets() {
  const { ready, authenticated, user, linkWallet, linkFarcaster } = usePrivy();

  const userWallets = user ? getUserWallets(user) : [];

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Select
      className="w-[150px]"
      defaultValue={{
        value: userWallets[0]?.address || "",
        label: userWallets[0]?.address || "",
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          className="native:text-lg text-sm text-foreground"
          placeholder="Select a wallet"
        />
      </SelectTrigger>
      <SelectContent className="flex w-full gap-4">
        <SelectGroup>
          {userWallets.map((wallet) => (
            <SelectItem key={wallet.address} label={shortPubKey(wallet.address)} value={wallet.address}>
              <View>
                <Wallet />
                {wallet.address}
              </View>
            </SelectItem>
          ))}
        </SelectGroup>
        <Pressable
          className="w-full flex-row items-center gap-2"
          onPress={linkWallet}
        >
          <PlusCircle />
          Link a wallet
        </Pressable>
        <Pressable
          className="w-full flex-row items-center gap-2"
          onPress={linkFarcaster}
        >
          <PlusCircle />
          Link Farcaster
        </Pressable>
      </SelectContent>
    </Select>
  );
}
