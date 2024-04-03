import React from "react";
import { ScrollView, View } from "react-native";
import Balance from "./UserBalance";
import CommunityTokens from "./UserCommunityTokens";

export default function UserTokens() {
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        <Balance />
        <CommunityTokens />
      </View>
    </ScrollView>
  );
}
