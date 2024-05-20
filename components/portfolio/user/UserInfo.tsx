import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { Minus, Plus, User } from "~/components/common/Icons";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { WARRPCAST } from "~/constants/farcaster";
import useUserBulk from "~/hooks/user/useUserBulk";
import { getUserFarcasterAccount } from "~/utils/privy";
import DegenTipsStats from "./DegenTipsStats";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import Toast from "react-native-toast-message";
import { Author } from "~/services/farcaster/types/neynar";
import { Loading } from "~/components/common/Loading";

export default function UserInfo({ fid }: { fid?: number }) {
  const { ready, authenticated, user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  fid = fid || farcasterAccount?.fid || undefined;
  const { items: userItems, load } = useUserBulk(
    farcasterAccount?.fid || undefined,
  );
  useEffect(() => {
    if (fid) load(fid);
  }, [farcasterAccount?.fid, fid]);

  const farcasterUserInfo = userItems.length > 0 ? userItems[0] : undefined;
  const userAvatar = useMemo(
    () => (farcasterUserInfo ? farcasterUserInfo.pfp_url : ""),
    [farcasterUserInfo],
  );
  const userDisplayName = farcasterUserInfo
    ? farcasterUserInfo.display_name
    : "";
  const username = farcasterUserInfo ? farcasterUserInfo.username : "";
  console.log(
    "farcasterUserInfo",
    farcasterUserInfo,
    userAvatar,
    userDisplayName,
    username,
  );
  // console.log("privy user info", user);
  if (!ready || !fid || !farcasterUserInfo) {
    return null;
  }
  return (
    <View className="flex-1 flex-row items-center gap-4">
      <View className="reletive">
        <Avatar alt={username} className="size-20">
          <AvatarImage source={{ uri: userAvatar }} />
          <AvatarFallback className="bg-white">
            <User className="size-16 fill-primary/80 font-medium text-primary" />
          </AvatarFallback>
        </Avatar>
        {farcasterAccount?.fid !== farcasterUserInfo?.fid && (
          <FollowUserButton farcasterUserInfo={farcasterUserInfo} />
        )}
      </View>
      <View className="flex w-full gap-1">
        <View className="w-full">
          {userDisplayName && (
            <Text className="line-clamp-1 font-bold text-white">
              {userDisplayName}
            </Text>
          )}
          {username && (
            <Text className="line-clamp-1 text-secondary">@{username}</Text>
          )}
        </View>
        <View className="w-full flex-row gap-4">
          {farcasterUserInfo?.following_count && (
            <ExternalLink
              href={`${WARRPCAST}/${username}/following`}
              target="_blank"
            >
              <Button
                variant="link"
                className="h-6 flex-row items-center gap-1 p-0"
              >
                <Text className="text-sm font-medium text-white">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(farcasterUserInfo.following_count)}
                </Text>
                <Text className="text-sm  text-secondary">Following</Text>
              </Button>
            </ExternalLink>
          )}
          {farcasterUserInfo?.follower_count && (
            <ExternalLink
              href={`${WARRPCAST}/${username}/followers`}
              target="_blank"
              asChild
            >
              <Button
                variant="link"
                className="h-6 flex-row items-center gap-1 p-0"
              >
                <Text className="text-sm font-medium text-white">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(farcasterUserInfo.follower_count)}
                </Text>
                <Text className="text-sm  text-secondary">Followers</Text>
              </Button>
            </ExternalLink>
          )}
        </View>
        {fid && (
          <View className="flex-row items-center gap-1">
            <DegenTipsStats fid={fid} />
            <Text className="text-sm text-secondary">Degen allowance</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function FollowUserButton({
  farcasterUserInfo,
}: {
  farcasterUserInfo: Author;
}) {
  const [followed, setFollowed] = React.useState<boolean>(
    farcasterUserInfo?.viewer_context?.following || false,
  );
  const [loading, setLoading] = React.useState(false);
  const { followUser, unfollowUser } = useFarcasterWrite();
  if (loading)
    return (
      <View className="absolute bottom-0 right-0 size-6">
        <Loading />
      </View>
    );
  if (followed)
    return (
      <Button
        size={"icon"}
        disabled={loading}
        className="absolute bottom-0 right-0 size-6 rounded-full bg-secondary"
        onPress={async () => {
          setLoading(true);
          const r = await unfollowUser(farcasterUserInfo?.fid || 0);
          console.log("unfollowUser", r);
          if (r) setFollowed(false);
          Toast.show({
            type: r ? "success" : "error",
            text1: r
              ? "UnFollowed " + farcasterUserInfo?.display_name
              : "Failed to unfollow!",
          });
          setLoading(false);
        }}
      >
        <Text>
          <Minus />
        </Text>
      </Button>
    );
  else
    return (
      <Button
        size={"icon"}
        disabled={loading}
        className="absolute bottom-0 right-0 size-6 rounded-full bg-secondary"
        onPress={async () => {
          setLoading(true);
          const r = await followUser(farcasterUserInfo?.fid || 0);
          console.log("followUser", r);
          if (r) setFollowed(true);
          Toast.show({
            type: r ? "success" : "error",
            text1: r
              ? "Followed " + farcasterUserInfo?.display_name
              : "Failed to follow!",
          });
          setLoading(false);
        }}
      >
        <Text>
          <Plus />
        </Text>
      </Button>
    );
}
