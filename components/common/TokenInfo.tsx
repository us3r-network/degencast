import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { round, upperFirst } from "lodash";
import { cn } from "~/lib/utils";

type TokenInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
  mc?: number;
  textClassName?: string;
};

export function TokenInfo({ name, logo, mc, textClassName }: TokenInfoProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar alt={name || ""} className="size-8">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="text-sm font-bold">
            {upperFirst(name?.slice(0, 2))}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View>
        <Text className={cn("text-md font-bold text-primary", textClassName)}>
          {name}
        </Text>
        {mc && mc > 0 && (
          <Text className="text-xs text-secondary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(mc)}
          </Text>
        )}
      </View>
    </View>
  );
}
