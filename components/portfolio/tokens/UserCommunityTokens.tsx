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
import { DEFAULT_CHAIN } from "~/constants";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { TokenInfoWithMetadata } from "~/services/user/types";
import TradeButton from "../TradeButton";
import { Link } from "expo-router";

const DEFAULT_ITEMS_NUM = 3;
export default function CommunityTokens() {
  const { items } = useUserCommunityTokens();
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">
            Community Token ({items.length})
          </Text>
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.contractAddress} {...item} />)}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.contractAddress} {...item} />)}
      </CollapsibleContent>
    </Collapsible>
  );
}

//todo: `/communities/${item.name}/shares`
function Item(item: TokenInfoWithMetadata) {
  return (
    <View className="flex-row items-center justify-between">
      <Link href={`/communities/${item.channelId}/tokens`} asChild>
        <Pressable>
          <TokenInfo name={item.name} logo={item.logo} />{" "}
        </Pressable>
      </Link>
      <View className="flex-row items-center gap-2">
        <Text>{round(Number(item.balance), 2)}</Text>
        <TradeButton
          fromChain={item.chainId || DEFAULT_CHAIN.id}
          fromToken={item.contractAddress as `0x${string}`}
        />
      </View>
    </View>
  );
}
