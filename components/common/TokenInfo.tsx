import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { upperFirst } from "lodash";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { formatUnits } from "viem";
import { TokenWithTradeInfo } from "~/services/trade/types";

type TokenInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  name?: string;
  logo?: string;
  mc?: number;
  balance?: string;
  symbol?: string;
  textClassName?: string;
};

export function TokenInfo({
  name,
  logo,
  symbol,
  mc,
  textClassName,
}: TokenInfoProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Avatar alt={name || ""} className={cn("size-8 border-2")}>
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback>
          <Text className="text-sm font-medium">
            {upperFirst(name?.slice(0, 2))}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View>
        <Text className={cn("line-clamp-1 text-sm font-medium", textClassName)}>
          {symbol}
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

type TokenWithValueProps = React.ComponentPropsWithoutRef<typeof View> & {
  token: TokenWithTradeInfo;
  value: bigint | number | string;
};

export function TokenWithValue({ token, value }: TokenWithValueProps) {
  if (typeof value === "bigint") {
    value = formatUnits(value, token.decimals || 18);
  }
  const displayValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
    notation: "compact",
  }).format(Number(value));

  return (
    <View className="flex-row items-center gap-2">
      <Avatar alt={token.name || ""} className={cn("size-8 border-2")}>
        <AvatarImage source={{ uri: token.logoURI || "" }} />
        <AvatarFallback>
          <Text className="text-sm font-medium">
            {upperFirst(token.name?.slice(0, 2))}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View>
        <Text className={cn("line-clamp-1 font-medium")}>
          {`${displayValue} ${token.symbol}`}
        </Text>
      </View>
    </View>
  );
}
