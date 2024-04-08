import { round } from "lodash";
import React from "react";
import { Linking, Text, View } from "react-native";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { TokenInfoWithMetadata } from "~/services/user/types";

export default function CommunityTokens() {
  const { items } = useUserCommunityTokens();
  return (
    <View className="flex w-full gap-2">
      {items?.length > 0 &&
        items.map((item) => <Item key={item.contractAddress} {...item} />)}
    </View>
  );
}

function Item(item: TokenInfoWithMetadata) {
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...item} />
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
