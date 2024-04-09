import React from "react";

import { View, Text } from "react-native";
import useFarcasterUserStats from "~/hooks/social-farcaster/useFarcasterUserStats";

export default function FarcasterStats({ fid }: { fid: number }) {
  const { farcasterUserStats } = useFarcasterUserStats(fid);
  return (
    <View className="w-full flex-row gap-2">
      <Text className="text-sm text-primary-foreground">
        {farcasterUserStats.followingCount} Following
      </Text>
      <Text className="text-sm text-primary-foreground">
        {farcasterUserStats.followerCount} Followers
      </Text>
    </View>
  );
}
