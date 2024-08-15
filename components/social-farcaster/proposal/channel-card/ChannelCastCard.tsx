import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import ChannelMetaInfo, { HomeChannelMetaInfo } from "./ChannelMetaInfo";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalStatusActions from "../proposal-status-actions/ProposalStatusActions";
import { CardWrapper } from "../ProposalStyled";
import { FCastMenuButton } from "../../FCastActions";
import FCastWithEmbed from "../FCastWithEmbed";

type ChannelCastCardProps = ViewProps & {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  cast: NeynarCast;
  proposal: ProposalEntity;
  isVisible?: boolean;
};
const ChannelCastCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCastCardProps
>(({ channel, proposal, cast, tokenInfo, isVisible, className }, ref) => {
  const { channelId } = channel || {};
  return (
    <CardWrapper className={cn("flex flex-col gap-4 p-4", className)} ref={ref}>
      {!channelId || channelId === "home" ? (
        <HomeChannelMetaInfo />
      ) : (
        <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
      )}

      <FCastWithEmbed cast={cast} channel={channel} isVisible={isVisible} />
      <View className="flex flex-row items-center justify-between">
        <FCastMenuButton cast={cast} communityInfo={channel as any} />
        <View className="ml-auto">
          <ProposalStatusActions
            cast={cast}
            channel={channel}
            tokenInfo={tokenInfo}
            proposal={proposal}
          />
        </View>
      </View>
    </CardWrapper>
  );
});

export default ChannelCastCard;
