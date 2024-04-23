import { View } from "react-native";
import { Text } from "~/components/ui/text";
import useFarcasterUserStats from "~/hooks/social-farcaster/useFarcasterUserStats";

export default function FarcasterStats({ fid }: { fid: number }) {
  const { farcasterUserStats } = useFarcasterUserStats(fid);
  return (
    <View className="w-full flex-row gap-6">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm font-bold text-white">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
          }).format(farcasterUserStats.followingCount)}
        </Text>
        <Text className="text-sm  text-secondary">Following</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm font-bold text-white">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
          }).format(farcasterUserStats.followerCount)}
        </Text>
        <Text className="text-sm  text-secondary">Followers</Text>
      </View>
    </View>
  );
}
