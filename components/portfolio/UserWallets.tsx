import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { getUserWallets } from "~/utils/privy";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserWallets() {
  const { ready, authenticated, user, linkWallet } = usePrivy();

  const userWallets = user ? getUserWallets(user) : [];

  if (!ready || !authenticated) {
    return null;
  }
  return (
    <View className="h-full w-full">
      <Select defaultValue={{ value: "apple", label: "Apple" }}>
        <SelectTrigger className="w-full">
          <SelectValue
            className="native:text-lg text-sm text-foreground"
            placeholder="Select a fruit"
          />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            {userWallets.map((wallet) => (
              <SelectItem label={wallet.address} value={wallet.address}>
                Apple
              </SelectItem>
            ))}
          </SelectGroup>
            <Button onPress={linkWallet}>
              Link a wallet
            </Button>
        </SelectContent>
      </Select>
    </View>
  );
}
