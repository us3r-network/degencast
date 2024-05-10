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
    <View className={cn("w-full flex-row gap-5", className)} {...props}>
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
              {formatNumberToUnitString(totalNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Members
            </Text>
          </View>
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              {formatNumberToUnitString(newPostNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Casts
            </Text>
          </View>
        </View>
        <Text className="line-clamp-2 text-base font-medium leading-6 text-secondary">
          {description}
        </Text>
      </View>
    </View>
  );
}
