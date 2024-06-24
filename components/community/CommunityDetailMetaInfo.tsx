import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityJoinIconButton } from "./CommunityJoinButton";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(Number(value));
};
export default function CommunityDetailMetaInfo({
  communityInfo,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityData;
}) {
  const { name, logo, description, memberInfo, hostUserData } = communityInfo;
  const { totalNumber, newPostNumber } = memberInfo || {};
  const fid = hostUserData?.[0]?.fid;
  const hostUserDataObjArr = hostUserData?.length
    ? userDataObjFromArr(hostUserData)
    : null;
  const hostUserDataObj = hostUserDataObjArr
    ? hostUserDataObjArr[fid as string]
    : null;

  return (
    <View className={cn("w-full flex-row gap-3", className)} {...props}>
      <Avatar alt={name || ""} className="size-20 border border-secondary">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="text-sm font-bold">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 flex-col gap-3">
        <Text className="text-base font-bold leading-none text-primary-foreground">
          {name}
        </Text>
        <View className="flex-row items-end gap-3">
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              {displayValue(totalNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Members
            </Text>
          </View>
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              {displayValue(newPostNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Casts
            </Text>
          </View>
        </View>
        {!!hostUserDataObj && (
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-secondary">
              Host
            </Text>
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              @{hostUserDataObj?.userName}
            </Text>
          </View>
        )}

        <Text className="line-clamp-1 text-sm font-medium leading-6 text-secondary">
          {description}
        </Text>
      </View>
      <View className=" flex h-20 flex-col justify-center">
        <CommunityJoinIconButton channelId={communityInfo?.channelId || ""} />
      </View>
    </View>
  );
}
