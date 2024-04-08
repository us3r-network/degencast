import { round } from "lodash";
import React from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { TokenInfoWithStats } from "~/services/trade/types";

export default function CommunityTokens() {
  const { items } = useCommunityTokens();
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="w-full">
      <View className="flex w-full gap-4">
        {items?.length > 0 &&
          items.map((item, index) => (
            <Item key={item.contractAddress} item={item} index={index + 1} />
          ))}
      </View>
    </ScrollView>
  );
}

function Item({ item, index }: { item: TokenInfoWithStats; index: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-4">
        <Text className="w-4 text-right text-md font-bold">{index}</Text>
        <TokenInfo {...item} />
      </View>
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
