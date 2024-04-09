import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommunityInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
};

export function CommunityInfo({ name, logo }: CommunityInfoProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar alt={name || ""} className="size-8">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="text-sm font-bold line-clamp-1">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <Text className="flex-1 text-md font-bold text-primary">{name}</Text>
    </View>
  );
}
