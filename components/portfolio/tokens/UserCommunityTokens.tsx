import { Link } from "expo-router";
import { round } from "lodash";
import React from "react";
import { Pressable, View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import { TokenInfo } from "~/components/common/TokenInfo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { TokenWithTradeInfo } from "~/services/trade/types";
import TradeButton from "../../trade/TradeButton";

const DEFAULT_ITEMS_NUM = 3;
export default function CommunityTokens({
  address,
}: {
  address: `0x${string}`;
}) {
  const { loading, items } = useUserCommunityTokens(address);
  const [open, setOpen] = React.useState(false);
  // console.log("my-tokens: ", address, items);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-secondary">
            Channel Tokens {loading ? "" : `(${items.length})`}
          </Text>
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.address} {...item} />)}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.address} {...item} />)}
      </CollapsibleContent>
    </Collapsible>
  );
}

function Item(item: TokenWithTradeInfo) {
  // console.log("item", item);
  return (
    <View className="flex-row items-center justify-between">
      {item.tradeInfo?.channel ? (
        <Link href={`/communities/${item.tradeInfo?.channel}/tokens`} asChild>
          <Pressable>
            <TokenInfo
              name={item.name}
              logo={item.logoURI}
              // mc={Number(item.tradeInfo?.stats?.fdv_usd)}
            />
          </Pressable>
        </Link>
      ) : (
        <TokenInfo
          name={item.name}
          logo={item.logoURI}
          // mc={Number(item.tradeInfo?.stats?.fdv_usd)}
        />
      )}
      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-medium">{round(Number(item.balance), 2)}</Text>
        <TradeButton token1={item} />
      </View>
    </View>
  );
}
