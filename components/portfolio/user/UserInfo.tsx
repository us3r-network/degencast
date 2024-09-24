import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Toast from "react-native-toast-message";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Minus, Plus, User } from "~/components/common/Icons";
import { Loading } from "~/components/common/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { WARRPCAST } from "~/constants/farcaster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useUserBulk from "~/hooks/user/useUserBulk";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { Author } from "~/services/farcaster/types/neynar";
import { shortPubKey } from "~/utils/shortPubKey";
import DegenTipsStats from "./DegenTipsStats";
import UserSettings from "./UserSettings";

export default function UserInfo({ fid }: { fid?: number }) {
  const { currFid } = useFarcasterAccount();
  const { linkedWallets } = useWalletAccount();
  const walletAccount =
    linkedWallets?.length > 0 ? linkedWallets[0] : undefined;
  fid = fid || currFid || undefined;
  const { userInfo, load } = useUserBulk(currFid || undefined);
  useEffect(() => {
    if (fid) load(fid);
  }, [fid]);

  const userAvatar = userInfo ? userInfo.pfp_url : "";
  const userDisplayName = userInfo
    ? userInfo.display_name
    : walletAccount
      ? shortPubKey(walletAccount.address)
      : "";
  const username = userInfo
    ? userInfo.username
    : walletAccount
      ? shortPubKey(walletAccount.address)
      : "";
  // console.log(
  //   "UserInfo",
  //   userInfo,
  //   userAvatar,
  //   userDisplayName,
  //   username,
  // );
  if (userInfo)
    return (
      <View className="flex-1 flex-row items-center gap-6 px-2">
        <View className="reletive">
          <Avatar alt={username} className="size-24 border-2 border-[#e0e0e0] ">
            <AvatarImage source={{ uri: "sss" }} />
            <AvatarFallback className="bg-white">
              <Image
                source={require("~/assets/images/user-avatar.png")}
                style={{ width: 96, height: 96 }}
              />
            </AvatarFallback>
          </Avatar>
          <View className="absolute bottom-0 right-0 size-6">
            {currFid !== userInfo.fid ? (
              <FollowUserButton farcasterUserInfo={userInfo} />
            ) : (
              <UserSettings />
            )}
          </View>
        </View>
        <View className="flex w-full gap-1">
          <View className="w-full space-y-0">
            <View className="flex-row items-center gap-1">
              {userDisplayName && (
                <Text className="line-clamp-1 font-bold text-white">
                  {userDisplayName}
                </Text>
              )}
              {userInfo.power_badge && (
                <Image
                  source={require("~/assets/images/active-badge.webp")}
                  style={{ width: 16, height: 16 }}
                />
              )}
            </View>
            {username && (
              <Text className="line-clamp-1 text-xs text-[#9BA1AD]">
                @{username}
              </Text>
            )}
          </View>
          <View className="w-full flex-row gap-4">
            {userInfo.following_count && (
              <ExternalLink
                href={`${WARRPCAST}/${username}/following`}
                target="_blank"
              >
                <Button
                  variant="link"
                  className="h-6 flex-row items-center gap-1 p-0"
                >
                  <Text className="text-xs font-medium text-white">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                    }).format(userInfo.following_count)}
                  </Text>
                  <Text className="text-xs text-[#9BA1AD]">Following</Text>
                </Button>
              </ExternalLink>
            )}
            {userInfo.follower_count && (
              <ExternalLink
                href={`${WARRPCAST}/${username}/followers`}
                target="_blank"
                asChild
              >
                <Button
                  variant="link"
                  className="h-6 flex-row items-center gap-1 p-0"
                >
                  <Text className="text-xs font-medium text-white">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                    }).format(userInfo.follower_count)}
                  </Text>
                  <Text className="text-xs text-[#9BA1AD]">Followers</Text>
                </Button>
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
  else
    return (
      <View className="flex-1 flex-row items-center gap-6 px-2">
        <View className="reletive">
          <Avatar alt={username} className="size-24 border-2">
            <AvatarFallback className="bg-white">
              <User className="size-16 fill-primary/80 font-medium text-primary" />
            </AvatarFallback>
          </Avatar>
          <View className="absolute bottom-0 right-0 size-6">
            <UserSettings />
          </View>
        </View>
        <View className="flex w-full gap-1">
          <View className="w-full space-y-0">
            {userDisplayName && (
              <Text className="line-clamp-1 font-bold text-white">
                {userDisplayName}
              </Text>
            )}
            {username && (
              <Text className="line-clamp-1 text-secondary">@{username}</Text>
            )}
          </View>
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
