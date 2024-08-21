import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { CardWrapper } from "./proposal/ProposalStyled";
import { FCastMenuButton } from "./FCastActions";
import ProposalStatusActions from "./proposal/proposal-status-actions/ProposalStatusActions";
import FCast from "./FCast";
type FCastReplyCardProps = ViewProps & {
  channel?: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  cast: NeynarCast;
  proposal?: ProposalEntity;
};
const FCastReplyCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & FCastReplyCardProps
>(({ channel, proposal, cast, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  return (
    <CardWrapper className={cn("flex flex-col gap-4 p-4", className)} ref={ref}>
      <FCast cast={cast} />
      <View className="flex flex-row items-center justify-between">
        {cast && channel && (
          <FCastMenuButton cast={cast} communityInfo={channel as any} />
        )}

        {!!cast && !!channel && !!channelId && !!tokenInfo && !!proposal && (
          <View className="ml-auto">
            <ProposalStatusActions
              cast={cast}
              channel={channel}
              tokenInfo={tokenInfo}
              proposal={proposal}
            />
          </View>
        )}
      </View>
    </CardWrapper>
  );
});

export default FCastReplyCard;
