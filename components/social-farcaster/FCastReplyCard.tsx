import { Pressable, View, ViewProps } from "react-native";
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
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { useRouter } from "expo-router";
import useCastDetails from "~/hooks/social-farcaster/useCastDetails";
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
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastDetails();
  return (
    <CardWrapper className={cn("flex flex-col gap-4 p-4", className)} ref={ref}>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          setCastDetailCacheData({
            cast,
            channel,
            proposal,
            tokenInfo,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        <FCast cast={cast} />
      </Pressable>
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
