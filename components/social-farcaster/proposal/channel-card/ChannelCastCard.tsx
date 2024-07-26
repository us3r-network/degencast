import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import ChannelMetaInfo, { HomeChannelMetaInfo } from "./ChannelMetaInfo";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { Separator } from "~/components/ui/separator";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import FCast from "../FCast";
import CastStatusActions from "../CastStatusActions";
import { CardWrapper } from "../ProposalStyled";

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
    <CardWrapper
      className={cn("flex flex-col gap-4 px-0", className)}
      ref={ref}
    >
      <View className={cn("w-full flex-col gap-4 px-4")}>
        {!channelId || channelId === "home" ? (
          <HomeChannelMetaInfo />
        ) : (
          <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
        )}
      </View>
      <Separator className="bg-primary/20" />

      <View className="flex w-full flex-col gap-4 px-4">
        <FCast cast={cast} channel={channel} />
        <CastStatusActions
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
          proposal={proposal}
        />
      </View>
    </CardWrapper>
  );
});

export default ChannelCastCard;
