import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { ExploreCard } from "../ExploreStyled";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { Separator } from "~/components/ui/separator";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import FCast from "../channel-card/FCast";
import ChannelMetaInfo, {
  HomeChannelMetaInfo,
} from "../channel-card/ChannelMetaInfo";

type ChannelCardProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
const ProposeCastCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCardProps
>(({ channel, cast, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  const attentionTokenAddress = channel?.attentionTokenAddress;
  return (
    <ExploreCard
      className={cn(
        "pointer-events-none z-20 flex h-[216px] flex-col gap-4 bg-white px-4",
        className,
      )}
      ref={ref}
    >
      {!channelId || channelId === "hoem" ? (
        <HomeChannelMetaInfo />
      ) : (
        <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} readOnly />
      )}
      <Separator className="bg-primary/20" />

      <FCast className="flex-1 overflow-hidden" cast={cast} />
    </ExploreCard>
  );
});

export default ProposeCastCard;
