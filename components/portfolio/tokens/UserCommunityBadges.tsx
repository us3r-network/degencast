import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Text } from "~/components/ui/text";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import { BadgeInfo } from "~/services/trade/types";
import {
  BuyButton,
  SellButton
} from "../../trade/BadgeButton";

export function CommunityBadge({ badge }: { badge: BadgeInfo }) {
  const account = useAccount();
  const { getNFTBalance } = useATTContractInfo(badge.tokenAddress);
  const { data: balance } = getNFTBalance(account?.address);
  console.log("CommunityBadge", badge, account?.address, balance)
  return (
    <View className="flex-row items-center justify-between">
      <Link href={`/communities/${badge.channelId}/shares`} asChild>
        <Pressable>
          <CommunityInfo {...badge} />
        </Pressable>
      </Link>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{balance}</Text>
        {balance !== undefined &&
          (balance > 0 ? (
            <SellButton
              logo={badge.logo}
              name={badge.name}
              tokenAddress={badge.tokenAddress}
            />
          ) : (
            <BuyButton
              logo={badge.logo}
              name={badge.name}
              tokenAddress={badge.tokenAddress}
            />
          ))}
      </View>
    </View>
  );
}
