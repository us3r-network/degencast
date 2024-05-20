import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { formatUnits } from "viem";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Loading } from "~/components/common/Loading";
import { BuyButton } from "~/components/trade/ShareButton";
import { Text } from "~/components/ui/text";
import useCommunityShares from "~/hooks/trade/useCommunityShares";
import { SHARE_CONTRACT_CHAIN } from "~/hooks/trade/useShareContract";
import { ShareInfo } from "~/services/trade/types";

export default function CommunityShares() {
  const { loading, items } = useCommunityShares();
  return (
    <View className="container h-full">
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="w-full">
          <View className="flex w-full gap-4">
            {items?.length > 0 &&
              items.map((item, index) => (
                <Item key={item.sharesSubject} item={item} index={index + 1} />
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
//todo: `/communities/${item.name}/shares`
function Item({ item, index }: { item: ShareInfo; index: number }) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-medium">{index}</Text>
        {/* {item.trend === 1 && <ArrowUp className="size-4 text-[green]" />}
        {item.trend === 0 && (
          <Text className="w-4 text-center font-medium">-</Text>
        )}
        {item.trend === -1 && <ArrowDown className="size-4 text-[red]" />} */}
        <Link
          className="flex-1"
          href={`/communities/${item.channelId}/shares`}
          asChild
        >
          <Pressable>
            <CommunityInfo {...item} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        {item.priceETH && (
          <Text className="text-sm">
            {formatUnits(
              BigInt(item.priceETH),
              SHARE_CONTRACT_CHAIN.nativeCurrency.decimals,
            )}{" "}
            {SHARE_CONTRACT_CHAIN.nativeCurrency.symbol}
          </Text>
        )}
        <BuyButton
          logo={item.logo}
          name={item.name}
          sharesSubject={item.sharesSubject}
        />
      </View>
    </View>
  );
}
