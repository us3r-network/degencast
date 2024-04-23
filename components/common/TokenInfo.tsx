import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { upperFirst } from "lodash";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

type TokenInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
  mc?: number;
  textClassName?: string;
};

export function TokenInfo({ name, logo, mc, textClassName }: TokenInfoProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar
        alt={name || ""}
        className={cn("size-8 border-2 border-secondary/10")}
      >
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="bg-secondary">
          <Text className="text-sm font-bold">
            {upperFirst(name?.slice(0, 2))}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View>
        <Text className={cn("line-clamp-1 font-bold", textClassName)}>
          {name}
        </Text>
        {mc && mc > 0 && (
          <Text className="text-xs text-secondary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            }).format(mc)}
          </Text>
        )}
      </View>
    </View>
  );
}
