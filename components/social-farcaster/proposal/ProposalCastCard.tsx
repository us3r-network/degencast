import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { ExploreCard } from "../../explore/ExploreStyled";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { Separator } from "~/components/ui/separator";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import FCast, { FCastWithNftImage } from "./FCast";
import ChannelMetaInfo, {
  HomeChannelMetaInfo,
} from "./channel-card/ChannelMetaInfo";
import { ProposalEntity } from "~/services/feeds/types/proposal";

type ChannelCardProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  proposal?: ProposalEntity;
};
const ProposalCastCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCardProps
>(({ channel, cast, tokenInfo, proposal, className }, ref) => {
  const { channelId } = channel || {};
  const attentionTokenAddress = channel?.attentionTokenAddress;
  return (
    <ExploreCard
      className={cn(
        "pointer-events-none z-20 flex flex-col gap-4 bg-white px-4",
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

      <FCastWithNftImage
        className="flex-1 overflow-hidden"
        cast={cast}
        channel={channel!}
        tokenInfo={tokenInfo}
        proposal={proposal}
      />
    </ExploreCard>
  );
});

export default ProposalCastCard;
