import React from "react";
import { ScrollView, Text, View } from "react-native";
import useCommunityShares from "~/hooks/trade/useCommunityShares";
import { ShareInfo } from "~/services/trade/types";
import { CommunityInfo } from "../common/CommunityInfo";
import { BuyButton } from "../portfolio/ShareButton";
import { ArrowDown, ArrowUp } from "~/components/common/Icons";
import { formatUnits } from "viem";
import { SHARE_CONTRACT_CHAIN } from "~/hooks/trade/useShareContract";

export default function CommunityShares() {
  const { items } = useCommunityShares();
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="w-full">
      <View className="flex w-full gap-4">
        {items?.length > 0 &&
          items.map((item, index) => (
            <Item key={item.sharesSubject} item={item} index={index + 1} />
          ))}
      </View>
    </ScrollView>
  );
}

function Item({ item, index }: { item: ShareInfo; index: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-4">
        <Text className="text-md w-4 text-right font-bold">{index}</Text>
        {item.trend === 1 && <ArrowUp className="size-4 text-[green]" />}
        {item.trend === 0 && <Text className="w-4 text-center font-bold">-</Text>}
        {item.trend === -1 && <ArrowDown className="size-4 text-[red]" />}
        <CommunityInfo {...item} />
      </View>
      <View className="flex-row items-center gap-2">
        <Text>
          {formatUnits(
            BigInt(item.priceETH),
            SHARE_CONTRACT_CHAIN.nativeCurrency.decimals,
          )}{" "}
          {SHARE_CONTRACT_CHAIN.nativeCurrency.symbol}
        </Text>
        <BuyButton
          logo={item.logo}
          name={item.name}
          sharesSubject={item.sharesSubject}
        />
      </View>
    </View>
  );
}
