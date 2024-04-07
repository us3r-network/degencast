import React from "react";
import { ScrollView, View } from "react-native";
import Balance from "./UserBalance";
import CommunityTokens from "./UserCommunityTokens";
import { useAccount } from "wagmi";

export default function UserTokens() {
  const { address } = useAccount();
  console.log("address from UserTokens", address);
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        <Balance address={address as `0x${string}`} />
        <CommunityTokens />
      </View>
    </ScrollView>
  );
}
