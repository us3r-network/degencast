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
import { TokenInfoWithMetadata } from "~/services/user/types";

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
  const toekn: TokenInfoWithMetadata = {
    chainId: item.chain_id,
    contractAddress: item.tokenAddress,
    name: item.name,
    logo: item.imageURL,
    tradeInfo: item,
  };
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-bold">{index}</Text>
        <Link
          className="flex-1"
          href={`/communities/${item.channel}/tokens`}
          asChild
        >
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
        <Text
          className={cn("text-sm", change < 0 ? "text-[red]" : "text-[green]")}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </Text>
        <TradeButton fromToken={toekn} />
      </View>
    </View>
  );
}
