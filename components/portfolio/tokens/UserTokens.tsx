import React from "react";
import { ScrollView, View } from "react-native";
import Balance from "./UserBalance";
import CommunityTokens from "./UserCommunityTokens";
import { useAccount } from "wagmi";
import Share from "./UserShare";
import Tips from "./UserTips";

export default function UserTokens() {
  const { address } = useAccount();
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        {address && <Balance address={address as `0x${string}`} />}
        <CommunityTokens />
        <Share />
        <Tips />
      </View>
    </ScrollView>
  );
}
