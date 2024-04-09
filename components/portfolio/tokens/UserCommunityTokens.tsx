import { round } from "lodash";
import React from "react";
import { Linking, Text, View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { TokenInfoWithMetadata } from "~/services/user/types";

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
          <Text className="text-lg font-bold text-primary">
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

function Item(item: TokenInfoWithMetadata) {
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo name={item.name} logo={item.logo}/>
      <View className="flex-row items-center gap-2">
        <Text>{round(Number(item.balance), 2)}</Text>
        <Button
          className="w-14 bg-secondary"
          onPress={() => {
            console.log("Trade button pressed");
            Linking.openURL("https://app.uniswap.org/");
          }}
        >
          <Text className="text-xs font-bold text-secondary-foreground">
            Trade
          </Text>
        </Button>
        {/* <TradeButton
          fromChain={base.id}
          fromToken={token.contractAddress as `0x${string}`}
          toChain={base.id}
          toToken={NATIVE_TOKEN}
        /> */}
      </View>
    </View>
  );
}
