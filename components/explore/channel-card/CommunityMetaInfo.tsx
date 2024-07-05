import { Pressable, View, ViewProps, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityAvatarJoinIconButton } from "~/components/community/CommunityJoinButton";
import { Link } from "expo-router";
import { Author } from "~/services/farcaster/types/neynar";
import useCommunityPage from "~/hooks/community/useCommunityPage";

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(Number(value));
};
export default function CommunityMetaInfo({
  communityInfo,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityData & {
    hosts?: Array<Author>;
  };
}) {
  const { navigateToCommunityDetail } = useCommunityPage();
  const { name, logo, description, memberInfo, channelId } = communityInfo;
  const hosts = communityInfo?.hosts || [];
  const host = hosts?.[0];
  const { totalNumber, newPostNumber } = memberInfo || {};

  return (
    <View className={cn("w-full flex-col gap-4", className)} {...props}>
      <Link className="w-full" href={`/communities/${channelId}`} asChild>
        <Pressable
          className="w-full flex-col gap-4"
          onPress={(e) => {
            e.stopPropagation();
            if (!channelId) return;
            navigateToCommunityDetail(channelId, communityInfo);
          }}
        >
          <View className={cn("w-full flex-row gap-3")}>
            <View className=" relative">
              <Avatar
                alt={name || ""}
                className="size-[50px] border border-secondary"
              >
                <AvatarImage source={{ uri: logo || "" }} />
                <AvatarFallback className="border-primary bg-secondary">
                  <Text className="text-sm font-bold">{name}</Text>
                </AvatarFallback>
              </Avatar>
              {channelId && (
                <CommunityAvatarJoinIconButton
                  channelId={channelId}
                  className=" absolute -bottom-1 -right-1"
                />
              )}
            </View>

            <View className="flex-1 flex-col justify-between">
              <Text className="line-clamp-1 text-xl font-bold leading-none">
                {name}
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm font-normal leading-none text-secondary">
                  {displayValue(totalNumber || 0)}{" "}
                  <Text className="text-sm font-normal leading-none">
                    Followers
                  </Text>
                </Text>
                <Text className="text-sm font-normal leading-none text-secondary">
                  {displayValue(newPostNumber || 0)}{" "}
                  <Text className="text-sm font-normal leading-none">
                    New Casts
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <Text className="line-clamp-2 text-sm font-normal leading-6">
            {description}
          </Text>
          {host && <HostUserInfo key={host.fid} data={host} />}
        </Pressable>
      </Link>
    </View>
  );
}

function HostUserInfo({
  data,
  className,
}: {
  className?: string;
  data: Author;
}) {
  const { fid, pfp_url, username, display_name } = data;
  return (
    <Link
      className={cn(" w-fit", className)}
      href={`/u/${fid}`}
      onPress={(e) => {
        e.stopPropagation();
      }}
    >
      <View className={cn("flex-row items-center gap-1")}>
        <Text className="line-clamp-1 text-sm font-normal leading-none">
          Host
        </Text>
        <Avatar alt={display_name || ""} className=" size-[20px]">
          <AvatarImage source={{ uri: pfp_url || "" }} />
          <AvatarFallback className="border-primary bg-secondary">
            <Text className="text-sm font-bold">{username}</Text>
          </AvatarFallback>
        </Avatar>

        <Text className="text-sm font-normal leading-none text-secondary hover:underline">
          @{username}
        </Text>
        {data.power_badge && (
          <Image
            source={require("~/assets/images/active-badge.webp")}
            style={{ width: 12, height: 12 }}
          />
        )}
      </View>
    </Link>
  );
}
