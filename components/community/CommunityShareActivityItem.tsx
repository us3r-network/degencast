import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";

export default function CommunityShareActivityItem({
  shareActivity,
  className,
  ...props
}: ViewProps & {
  shareActivity: any;
}) {
  const name = "John Doe " + shareActivity.id;
  const handle = "johndoe" + shareActivity.id;
  const avatar = `https://ui-avatars.com/api/?name=John+Doe+${shareActivity.id}`;
  return (
    <View className={cn("flex-row items-center gap-3", className)} {...props}>
      <Avatar alt={name || ""} className=" size-10">
        <AvatarImage source={{ uri: avatar || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="font-interBold text-sm">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 flex-col gap-1">
        <Text className=" font-interMedium line-clamp-1 text-base leading-none">
          {name}
        </Text>
        <Text className=" line-clamp-1 text-xs leading-none text-[#A36EFE]">
          @{handle}
        </Text>
      </View>
      <View>
        <Text className=" text-base leading-none text-[#00D1A7]">+ $9999</Text>
        <Text className=" text-base leading-none text-[#F41F4C]">- $9999</Text>
      </View>
    </View>
  );
}
