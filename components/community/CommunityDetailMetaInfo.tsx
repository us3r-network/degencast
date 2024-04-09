import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatNumberToUnitString } from "~/utils/number";
import { cn } from "~/lib/utils";

export default function CommunityDetailMetaInfo({
  communityInfo,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityData;
}) {
  const { name, logo, description, memberInfo } = communityInfo;
  const { totalNumber, newPostNumber } = memberInfo || {};
  return (
    <View className={cn("flex-row gap-5", className)} {...props}>
      <Avatar alt={name || ""} className=" size-20">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="text-sm font-bold">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-col gap-3">
        <Text className=" text-base font-bold leading-none  text-primary-foreground">
          {name}
        </Text>
        <Text className=" line-clamp-1 text-base leading-none text-[#A36EFE]">
          {description}
        </Text>
        <View className=" flex-row items-end gap-3">
          <View className=" flex-row gap-1">
            <Text className=" text-sm leading-none  text-primary-foreground">
              {formatNumberToUnitString(totalNumber || 0)}
            </Text>
            <Text className=" text-sm leading-none  text-[#A36EFE]">
              members
            </Text>
          </View>
          <View className=" flex-row gap-1">
            <Text className=" text-sm leading-none  text-primary-foreground">
              {formatNumberToUnitString(newPostNumber || 0)}
            </Text>
            <Text className=" text-sm leading-none  text-[#A36EFE]">casts</Text>
          </View>
        </View>
      </View>
    </View>
  );
}