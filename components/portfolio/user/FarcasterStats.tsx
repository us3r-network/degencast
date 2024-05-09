import { View } from "react-native";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterUserStats from "~/hooks/social-farcaster/useFarcasterUserStats";

const WARRPCAST = "https://warpcast.com";
export default function FarcasterStats({
  fid,
  fname,
}: {
  fid: number;
  fname: string;
}) {
  const { farcasterUserStats } = useFarcasterUserStats(fid);
  return (
    <View className="w-full flex-row gap-4">
      <ExternalLink href={`${WARRPCAST}/${fname}/following`} target="_blank">
        <Button variant="link" className="h-6 flex-row items-center gap-1 p-0">
          <Text className="font-interBold text-sm text-white">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format(farcasterUserStats.followingCount)}
          </Text>
          <Text className="text-sm  text-secondary">Following</Text>
        </Button>
      </ExternalLink>
      <ExternalLink
        href={`${WARRPCAST}/${fname}/followers`}
        target="_blank"
        asChild
      >
        <Button variant="link" className="h-6 flex-row items-center gap-1 p-0">
          <Text className="font-interBold text-sm text-white">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format(farcasterUserStats.followerCount)}
          </Text>
          <Text className="text-sm  text-secondary">Followers</Text>
        </Button>
      </ExternalLink>
      <ExternalLink href={`${WARRPCAST}/${fname}`} target="_blank" asChild>
        <Button variant="link" className="h-6 flex-row items-center gap-1 p-0">
          <Text className="font-interBold text-sm text-white">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format(farcasterUserStats.postCount)}
          </Text>
          <Text className="text-sm  text-secondary">Casts</Text>
        </Button>
      </ExternalLink>
    </View>
  );
}
