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

export default function ChannelCard({
  communityInfo,
  cast,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityInfo;
  cast?: FarCast | NeynarCast | null;
}) {
  const { channelId } = communityInfo;
  const { loading: communityTokensLoading, items: communityTokens } =
    useCommunityTokens();
  const tokenAddress = communityInfo?.tokens?.[0]?.contract;
  const communityToken = communityTokens.find(
    (item) =>
      (item.tradeInfo?.channel && item.tradeInfo.channel === channelId) ||
      (tokenAddress && item.tradeInfo?.tokenAddress === tokenAddress),
  );

  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost =
    !!channelId && !!channels.find((channel) => channel.id === channelId);

  return (
    <ExploreCard
      className={cn("flex-col gap-4 bg-[#F5F0FE] px-0", className)}
      {...props}
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
      <View className={cn("w-full flex-col gap-4 px-4")}>
        {communityToken && <ExploreTradeButton token2={communityToken} />}
        {channelId && !communityToken && isChannelHost && (
          <ExploreApplyLaunchButton channelId={channelId} />
        )}
      </View>
    </ExploreCard>
  );
}
