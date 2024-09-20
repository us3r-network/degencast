import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import React from "react";
import { ViewRef } from "@rn-primitives/types";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { CardWrapper } from "./proposal/ProposalStyled";
import ChannelMetaInfo, {
  HomeChannelMetaInfo,
} from "./proposal/channel-card/ChannelMetaInfo";
import FCastMenuButton from "./FCastMenuButton";
import ProposalStatusActions from "./proposal/proposal-status-actions/ProposalStatusActions";
import FCast from "./FCast";
type FCastDetailsCardProps = ViewProps & {
  channel?: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  cast: NeynarCast;
  proposal?: ProposalEntity;
};
const FCastDetailsCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & FCastDetailsCardProps
>(({ channel, proposal, cast, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  return (
    <CardWrapper className={cn("flex flex-col gap-4 p-4", className)} ref={ref}>
      {channel && !channelId ? (
        <HomeChannelMetaInfo />
      ) : channel ? (
        <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
      ) : null}

      <FCast cast={cast} />
      <View className="flex flex-row items-center justify-between">
        {cast && channel && (
          <FCastMenuButton
            cast={cast}
            communityInfo={channel as any}
            proposal={proposal}
          />
        )}

        {cast && channelId && (
          <View className="ml-auto">
            <ProposalStatusActions
              cast={cast}
              channel={channel!}
              tokenInfo={tokenInfo}
              proposal={proposal!}
            />
          </View>
        )}
      </View>
    </CardWrapper>
  );
});

export default FCastDetailsCard;
