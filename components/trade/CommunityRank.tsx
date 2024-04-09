import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import useLoadTrendingCommunities from "~/hooks/community/useLoadTrendingCommunities";
import { CommunityInfo } from "../common/CommunityInfo";
import { CommunityInfo as CommunityInfoType } from "~/services/community/types/community";

export default function CommunityRank() {
  const { trendingCommunities: items, loadTrendingCommunities } =
    useLoadTrendingCommunities();
  useEffect(() => {
    loadTrendingCommunities();
  }, [loadTrendingCommunities]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="w-full">
      <View className="flex w-full gap-4">
        {items?.length > 0 &&
          items.map((item, index) => (
            <Item key={item.channelId} item={item} index={index + 1} />
          ))}
      </View>
    </ScrollView>
  );
}

function Item({ item, index }: { item: CommunityInfoType; index: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-4">
        <Text className="text-md w-4 text-right font-bold">{index}</Text>
        <CommunityInfo name={item.name} logo={item.logo} />
      </View>
      <View className="flex-row items-center gap-2">
        <Text>{item.memberInfo.totalNumber}</Text>
        <Button
          disabled
          className="w-14 bg-secondary"
          onPress={() => {
            console.log("join button pressed");
          }}
        >
          <Text className="text-xs font-bold text-secondary-foreground">
            Join
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
