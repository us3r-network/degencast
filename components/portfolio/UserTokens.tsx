import { Linking } from "react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAccount } from "wagmi";
import useUserTokens from "~/hooks/user/useUserTokens";
import { Info } from "../Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { round } from "lodash";

export default function UserTokens() {
  return (
    <View className="w-full flex-row gap-2">
      <Balance />
    </View>
  );
}

const tokenAddress: string[] = [
  "0x0000000000000000000000000000000000000000", // ETH
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // Degen
];

function Balance() {
  //Define the owner address or name
  const { address } = useAccount();
  const { tokens } = useUserTokens(address || "0x", tokenAddress);
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">Balance</Text>
          <Info size={16} />
        </View>
        <Pressable>
          <Text className="font-bold text-secondary">Send</Text>
        </Pressable>
      </View>
      {tokens.map((token) => (
        <View
          key={token.contractAddress}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-2">
            <Avatar alt={token.name || token.symbol || ""} className="size-8">
              <AvatarImage source={{ uri: token.logo }} />
              <AvatarFallback>
                <Text>{token.name}</Text>
              </AvatarFallback>
            </Avatar>
            <Text className="text-lg font-bold text-primary">{token.name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text>
              {round(Number(token.balance), 2)} {token.symbol}
            </Text>
            <Button
              className="bg-secondary font-bold"
              onPress={() => {
                Linking.openURL("https://buy-sandbox.moonpay.com/");
              }}
            >
              <Text className="font-bold text-secondary-foreground">Buy</Text>
            </Button>
          </View>
        </View>
      ))}
    </View>
  );
}
