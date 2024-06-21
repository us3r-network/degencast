import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
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
  const moderators = communityInfo?.moderators || [];
  const { totalNumber, newPostNumber } = memberInfo || {};

  return (
    <View className={cn("w-full flex-col gap-4", className)} {...props}>
      <Link
        className="w-full"
        href={`/communities/${communityInfo.channelId}`}
        asChild
      >
        <Pressable
          className="w-full flex-col gap-4"
          onPress={(e) => {
            e.stopPropagation();
            if (!channelId) return;
            navigateToCommunityDetail(channelId, communityInfo);
          }}
        >
          <View className={cn("w-full flex-row gap-3")}>
            <Avatar
              alt={name || ""}
              className=" size-[50px] border border-secondary"
            >
              <AvatarImage source={{ uri: logo || "" }} />
              <AvatarFallback className="border-primary bg-secondary">
                <Text className="text-sm font-bold">{name}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1 flex-col justify-between">
              <Text className="text-base font-bold leading-none">{name}</Text>
              <View className="flex-row items-end gap-3">
                <Text className="text-sm font-normal leading-none">
                  {displayValue(totalNumber || 0)} Members
                </Text>
                <Text className="text-sm font-normal leading-none">
                  {displayValue(newPostNumber || 0)} New Casts
                </Text>
              </View>
            </View>
            <View className=" flex h-[50px] flex-col justify-center">
              <CommunityJoinButton communityInfo={communityInfo} />
            </View>
          </View>
          {moderators.length > 0 && (
            <View className=" inline-block">
              {moderators.map((item, idx) => {
                return (
                  <Avatar
                    key={idx.toString()}
                    alt={item.username || ""}
                    className={cn(
                      " inline-block size-[20px] align-middle",
                      idx > 0 ? " -ml-1" : "",
                    )}
                  >
                    <AvatarImage source={{ uri: item.pfp_url || "" }} />
                    <AvatarFallback className="bg-secondary">
                      <Text className="text-sm font-bold">{item.username}</Text>
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              <Text className=" ml-1 inline align-middle text-sm font-normal">
                Moderated by
              </Text>

              {moderators.map((item, idx) => {
                return (
                  <Link
                    asChild
                    href={`/u/${item.fid}/tokens`}
                    key={idx.toString()}
                  >
                    <Text className="ml-1 inline align-middle text-sm font-normal text-secondary hover:cursor-pointer hover:underline">
                      {`@${item.username}`}
                    </Text>
                  </Link>
                );
              })}
            </View>
          )}

          <Text className="line-clamp-2 text-sm font-normal leading-6">
            {description}
          </Text>
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
  data: {
    fid: string | number;
    avatar: string;
    username: string;
    displayName: string;
  };
}) {
  const { fid, avatar, username, displayName } = data;
  return (
    <Link className={cn("w-full", className)} href={`/u/${fid}`} asChild>
      <Pressable className="w-full">
        <View className={cn("w-full flex-row gap-1")}>
          <Avatar
            alt={displayName || ""}
            className=" size-[40px] border border-secondary"
          >
            <AvatarImage source={{ uri: avatar || "" }} />
            <AvatarFallback className="border-primary bg-secondary">
              <Text className="text-sm font-bold">{displayName}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 flex-col gap-3">
            <Text className="line-clamp-1 text-base font-medium leading-none">
              {displayName}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              @{username}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
