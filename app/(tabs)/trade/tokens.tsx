import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { TokenInfo } from "~/components/common/TokenInfo";
import TradeButton from "~/components/portfolio/TradeButton";
import { Text } from "~/components/ui/text";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { cn } from "~/lib/utils";
import { TokenInfoWithStats } from "~/services/trade/types";

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
        <Link href={`/communities/${item.channel}/tokens`} asChild>
          <Pressable>
            <TokenInfo
              name={item.name}
              logo={item.imageURL}
              mc={Number(item.stats.fdv_usd)}
            />
          </Pressable>
        </Link>
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