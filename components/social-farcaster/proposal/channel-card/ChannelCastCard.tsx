import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import ChannelMetaInfo, { HomeChannelMetaInfo } from "./ChannelMetaInfo";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import FCast from "../FCast";
import CastStatusActions from "../CastStatusActions";
import { CardWrapper } from "../ProposalStyled";
import { FCastExploreActions } from "../../FCastActions";

type ChannelCastCardProps = ViewProps & {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  cast: NeynarCast;
  proposal: ProposalEntity;
};
const ChannelCastCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCastCardProps
>(({ channel, proposal, cast, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  return (
    <CardWrapper className={cn("flex flex-col gap-4 p-4", className)} ref={ref}>
      {!channelId || channelId === "home" ? (
        <HomeChannelMetaInfo />
      ) : (
        <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
      )}

      <FCast cast={cast} channel={channel} />
      <View className="flex flex-row items-center justify-between">
        <CastStatusActions
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
          proposal={proposal}
        />
        <View className="ml-auto">
          <FCastExploreActions cast={cast} communityInfo={channel as any} />
        </View>
      </View>
    </CardWrapper>
  );
});

export default ChannelCastCard;
