import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

type CommunityInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
};

export function CommunityInfo({ name, logo }: CommunityInfoProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar
        alt={name || ""}
        className={cn("size-8 border-2 border-secondary/10")}
      >
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="bg-secondary">
          <Text className="font-interBold text-sm">
            {name?.substring(0, 2)}
          </Text>
        </AvatarFallback>
      </Avatar>
      <Text className={cn("font-interBold line-clamp-1")}>{name}</Text>
    </View>
  );
}
