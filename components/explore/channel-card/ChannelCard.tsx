import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import CommunityMetaInfo from "./CommunityMetaInfo";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { ExploreTradeButton } from "~/components/trade/TradeButton";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import { ExploreApplyLaunchButton } from "~/components/common/ApplyLaunchButton";
import { ExploreCard } from "../ExploreStyled";
import ChannelCardCasts from "./ChannelCardCasts";
import CommunityBuyShareButton from "~/components/community/CommunityBuyShareButton";
import React from "react";
import { ViewRef } from "~/components/primitives/types";

type ChannelCardProps = ViewProps & {
  communityInfo: CommunityInfo;
  cast?: FarCast | NeynarCast | null;
};
const ChannelCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCardProps
>(({ communityInfo, cast, className }, ref) => {
  const { channelId } = communityInfo;
  const { loading: communityTokensLoading, items: communityTokens } =
    useCommunityTokens();
  const tokenAddress = communityInfo?.tokens?.[0]?.contract;
  const communityToken = communityTokens.find(
    (item) =>
      (item.tradeInfo?.channel && item.tradeInfo.channel === channelId) ||
      (tokenAddress && item.tradeInfo?.tokenAddress === tokenAddress),
  );
  const attentionTokenAddress = communityInfo?.attentionTokenAddress;

  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost =
    !!channelId && !!channels.find((channel) => channel.id === channelId);

  return (
    <ExploreCard
      className={cn("flex-col gap-4 bg-[#F5F0FE] px-0", className)}
      ref={ref}
    >
      <View className={cn("w-full flex-col gap-4 px-4")}>
        <CommunityMetaInfo communityInfo={communityInfo} />
      </View>

      {channelId && (
        <View className="w-full flex-1">
          <ChannelCardCasts
            channelId={channelId}
            communityInfo={communityInfo}
          />
        </View>
      )}

      {/* {communityToken ? (
        <View className={cn("w-full flex-col gap-4 px-4")}>
          <ExploreTradeButton token2={communityToken} />
        </View>
      ) : (
        !attentionTokenAddress &&
        channelId &&
        isChannelHost && (
          <View className={cn("w-full flex-col gap-4 px-4")}>
            <ExploreApplyLaunchButton channelId={channelId} />
          </View>
        )
      )} */}

      {!attentionTokenAddress && channelId && isChannelHost && (
        <View className={cn("w-full flex-col gap-4 px-4")}>
          <ExploreApplyLaunchButton channelId={channelId} />
        </View>
      )}
    </ExploreCard>
  );
});

export default ChannelCard;
