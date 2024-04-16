import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

type CommunityInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
  textClassName?: string;
};

export function CommunityInfo({
  name,
  logo,
  textClassName,
}: CommunityInfoProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar alt={name || ""} className="size-8">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="bg-secondary">
          <Text className="line-clamp-1 text-sm font-bold">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <Text className={cn("font-bold", textClassName)}>
        {name}
      </Text>
    </View>
  );
}
