import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useAccount } from "wagmi";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Text } from "~/components/ui/text";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import { BadgeInfo } from "~/services/trade/types";
import { BuyButton, SellButton } from "../../trade/BadgeButton";

export function CommunityBadge({ badge }: { badge: BadgeInfo }) {
  const account = useAccount();
  const { nftBalanceOf } = useATTContractInfo(
    badge.tokenAddress,
    badge.tokenId || 0,
  );
  const { data: balance } = nftBalanceOf(account?.address);
  // console.log("CommunityBadge", badge, account?.address, balance);
  return (
    <View className="flex-row items-center justify-between">
      <Link href={`/communities/${badge.channelId}/shares`} asChild>
        <Pressable>
          <CommunityInfo {...badge} />
        </Pressable>
      </Link>
      <View className="flex-row items-center gap-2">
        nft
        <Text className="text-sm">{Number(balance)}</Text>
        {balance !== undefined &&
          (balance > 0 ? (
            <SellButton
              tokenAddress={badge.tokenAddress}
              tokenId={1} //todo: use cast tokenId from api
            />
          ) : (
            <BuyButton
              tokenAddress={badge.tokenAddress}
              tokenId={1} //todo: use cast tokenId from api
            />
          ))}
      </View>
    </View>
  );
}
