import { View } from "react-native";
import { Text } from "~/components/ui/text";
import useFarcasterUserStats from "~/hooks/social-farcaster/useFarcasterUserStats";

export default function FarcasterStats({ fid }: { fid: number }) {
  const { farcasterUserStats } = useFarcasterUserStats(fid);
  return (
    <View className="w-full flex-row gap-2">
      <Text className="text-sm text-white">
        {farcasterUserStats.followingCount} Following
      </Text>
      <Text className="text-sm text-white">
        {farcasterUserStats.followerCount} Followers
      </Text>
    </View>
  );
}
