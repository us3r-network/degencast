import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { TokenInfo } from "~/components/common/TokenInfo";
import TradeButton from "~/components/trade/TradeButton";
import { Text } from "~/components/ui/text";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";

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
                <Item key={item.address} item={item} index={index + 1} />
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Item({ item, index }: { item: TokenWithTradeInfo; index: number }) {
  const change = Number(item.tradeInfo?.stats.price_change_percentage.h24) || 0;
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-medium">{index}</Text>
        {item.tradeInfo?.channel ? (
          <Link href={`/communities/${item.tradeInfo?.channel}/tokens`} asChild>
            <Pressable>
              <TokenInfo
                name={item.name}
                logo={item.logoURI}
                mc={Number(item.tradeInfo?.stats?.fdv_usd)}
              />
            </Pressable>
          </Link>
        ) : (
          <TokenInfo
            name={item.name}
            logo={item.logoURI}
            mc={Number(item.tradeInfo?.stats?.fdv_usd)}
          />
        )}
      </View>
      <View className="flex-row items-center gap-2">
        <Text
          className={cn("text-sm", change < 0 ? "text-[red]" : "text-[green]")}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </Text>
        <TradeButton token2={item} />
      </View>
    </View>
  );
}
