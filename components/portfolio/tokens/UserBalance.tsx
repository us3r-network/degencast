import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useAccount } from "wagmi";
import useUserTokens from "~/hooks/user/useUserTokens";
import { Info } from "../../Icons";
import { Button } from "../../ui/button";
import { TokenInfo } from "./TokenInfo";

const tokenAddress: string[] = [
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // Degen
];

export default function Balance() {
  const { address } = useAccount();
  const { nativeTokens, tokens } = useUserTokens(address || "0x", tokenAddress);
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
      {[...nativeTokens, ...tokens].map((token) => (
        <MyToken key={token.contractAddress} {...token} />
      ))}
    </View>
  );
}

function MyToken(token: OwnedToken) {
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...token} />
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
  );
}
