import React from "react";
import { ScrollView, Text, View } from "react-native";
import { base } from "viem/chains";
import { TokenInfo } from "~/components/common/TokenInfo";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { cn } from "~/lib/utils";
import { TokenInfoWithStats } from "~/services/trade/types";
import TradeButton from "../portfolio/TradeButton";
import { Loading } from "../common/Loading";

export default function CommunityTokens() {
  const { loading, items } = useCommunityTokens();
  return (
    <View className="container h-full">
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="w-full">
          <View className="flex w-full gap-4">
            {items?.length > 0 &&
              items.map((item, index) => (
                <Item key={item.tokenAddress} item={item} index={index + 1} />
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Item({ item, index }: { item: TokenInfoWithStats; index: number }) {
  const change = Number(item.stats.price_change_percentage.h24);
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-4">
        <Text className="text-md w-4 text-right font-bold">{index}</Text>
        <TokenInfo
          name={item.name}
          logo={item.imageURL}
          mc={Number(item.stats.fdv_usd)}
        />
      </View>
      <View className="flex-row items-center gap-2">
        <Text className={cn(change < 0 ? "text-[red]" : "text-[green]")}>
          {change > 0 ? "+" : ""}
          {change}%
        </Text>
        <TradeButton
          fromChain={item.chain_id}
          fromToken={item.tokenAddress as `0x${string}`}
        />
      </View>
    </View>
  );
}
