import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Toast from "react-native-toast-message";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Minus, Plus } from "~/components/common/Icons";
import { Loading } from "~/components/common/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { WARRPCAST } from "~/constants/farcaster";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useUserBulk from "~/hooks/user/useUserBulk";
import { Author } from "~/services/farcaster/types/neynar";
import DegenTipsStats from "./DegenTipsStats";
import UserSettings from "./UserSettings";

export default function UserInfo({
  fid,
  viewerFid,
}: {
  fid: number;
  viewerFid?: number;
}) {
  const { userInfo, load } = useUserBulk(viewerFid);
  useEffect(() => {
    if (fid) load(fid);
  }, [fid]);

  // console.log("UserInfo", userInfo);
  if (userInfo)
    return (
      <View className="flex-1 flex-row items-center gap-6 px-2">
        <View className="reletive">
          <Avatar
            alt={userInfo.username}
            className="size-24 border-2 border-[#e0e0e0]"
          >
            <AvatarImage source={{ uri: userInfo.pfp_url }} />
            <AvatarFallback className="bg-white">
              <Image
                source={require("~/assets/images/user-avatar.png")}
                style={{ width: 96, height: 96 }}
              />
            </AvatarFallback>
          </Avatar>
          {viewerFid ? (
            <View className="absolute bottom-0 right-0 size-6">
              {fid === viewerFid ? <UserSettings /> : null}
            </View>
          ) : null}
        </View>
        <View className="flex w-full gap-2">
          <View className="w-full space-y-0">
            <View className="flex-row items-center gap-1">
              {userInfo.display_name && (
                <Text className="line-clamp-1 font-bold text-white">
                  {userInfo.display_name}
                </Text>
              )}
              {userInfo.power_badge && (
                <Image
                  source={require("~/assets/images/active-badge.webp")}
                  style={{ width: 16, height: 16 }}
                />
              )}
            </View>
            {userInfo.username && (
              <Text className="line-clamp-1 text-xs text-[#9BA1AD]">
                @{userInfo.username}
              </Text>
            )}
          </View>
          <View className="w-full flex-row gap-4">
            {userInfo.following_count && (
              <ExternalLink
                href={`${WARRPCAST}/${userInfo.username}/following`}
                target="_blank"
              >
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-medium text-white">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                    }).format(userInfo.following_count)}
                  </Text>
                  <Text className="text-xs text-[#9BA1AD]">Following</Text>
                </View>
              </ExternalLink>
            )}
            {userInfo.follower_count && (
              <ExternalLink
                href={`${WARRPCAST}/${userInfo.username}/followers`}
                target="_blank"
                asChild
              >
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-medium text-white">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                    }).format(userInfo.follower_count)}
                  </Text>
                  <Text className="text-xs text-[#9BA1AD]">Followers</Text>
                </View>
              </ExternalLink>
            )}
          </View>
          {fid && (
            <View className="flex-row items-center gap-1">
              <Image
                source={require("~/assets/images/degen-icon-2.png")}
                style={{ width: 20, height: 20 }}
              />
              <DegenTipsStats fid={fid} />
              <Text className="text-xs text-[#9BA1AD]">DEGEN allowance</Text>
            </View>
          )}
        </View>
      </View>
    );
}
/*
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
      <View className="size-6">
        <Loading />
      </View>
    );
  if (followed)
    return (
      <Button
        size={"icon"}
        disabled={loading}
        className="size-6 rounded-full border-2 border-white bg-secondary"
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
          <Minus size={16} />
        </Text>
      </Button>
    );
  else
    return (
      <Button
        size={"icon"}
        disabled={loading}
        className="absolute bottom-0 right-0 size-6 rounded-full border-2 border-white bg-secondary"
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
          <Plus size={16} />
        </Text>
      </Button>
    );
}
*/
